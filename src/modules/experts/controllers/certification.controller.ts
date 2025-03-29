import { api, APIError, ErrCode } from "encore.dev/api";
import busboy from "busboy";
import { expertService } from "../services/expert.service";
import { getAuthData } from "~encore/auth";
import { logger } from "../../../shared/logger";
import { certificateFiles } from "../storage/certificate-files";
import { db } from "../../../database/drizzle";
import { expertCertifications } from "../../../database/schemas/expert-certifications.schema";
import { IncomingMessage, ServerResponse } from "node:http";

// Configuration constants
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/jpg'
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB limit


type ApiResponse = {
  success: boolean;
  message: string;
  data?: Record<string, any>;
};

type UploadedFile = {
  buffer: Buffer;
  filename: string;
  mimetype: string;
  size: number;
};

// Helper function to send JSON response with proper typing
function sendJsonResponse(
  res: ServerResponse, 
  status: number, 
  data: ApiResponse
) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

/**
 * Raw endpoint for uploading certification files directly.
 * Handles multipart/form-data uploads with size limits and file type validation.
 */
export const uploadCertificationFile = api.raw(
  { 
    expose: true, 
    method: "POST", 
    path: "/experts/certifications/upload", 
    auth: true,
    bodyLimit: null 
  },
  async (req: IncomingMessage, res: ServerResponse) => {
    try {
      // Get the authenticated expert
      const userID = Number(getAuthData()!.userID);
      const expert = await expertService.getExpertByUserId(userID);
      
      if (!expert) {
        return sendJsonResponse(res, 403, {
          success: false,
          message: "User is not an expert"
        });
      }
      
      const result = await processCertificationUpload(req, expert.id);
      sendJsonResponse(res, 200, {
        success: true,
        message: "Certification uploaded successfully",
        data: result
      });
    } catch (error) {
      handleUploadError(error, res);
    }
  }
);

/**
 * Process the certification file upload with validation
 */
async function processCertificationUpload(
  req: IncomingMessage, 
  expertId: number
): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    const bb = busboy({ 
      headers: req.headers,
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES,
        files: 1 
      }
    });
    
    const formData: Record<string, string> = { expert_id: String(expertId) };
    let fileData: UploadedFile | null = null;
    let fileExceeded = false;
    
    // Handle form fields
    bb.on("field", (name, val) => {
      formData[name] = val;
    });
    
    // Handle file upload
    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      
      // Validate file type first
      if (!isValidFileType(mimeType)) {
        file.resume(); // Skip processing this file
        return reject(new APIError(ErrCode.InvalidArgument, 
          `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`));
      }
      
      const chunks: Buffer[] = [];
      let fileSize = 0;
      
      file.on("data", (chunk) => {
        fileSize += chunk.length;
        
        // Check file size during streaming
        if (fileSize > MAX_FILE_SIZE_BYTES) {
          fileExceeded = true;
          file.resume(); // Skip remaining chunks
          return;
        }
        
        chunks.push(chunk);
      });
      
      file.on("limit", () => {
        fileExceeded = true;
        logger.warn(`File size exceeded limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`);
      });
      
      file.on("end", () => {
        if (fileExceeded) {
          return; // Size validation will be handled in the close event
        }
        
        if (chunks.length > 0) {
          fileData = {
            buffer: Buffer.concat(chunks),
            filename,
            mimetype: mimeType,
            size: fileSize
          };
          logger.info(`File uploaded: ${filename}, size: ${fileSize} bytes`);
        }
      });
    });
    
    // Handle form completion
    bb.on("close", async () => {
      try {
        // Check for file size exceeded
        if (fileExceeded) {
          return reject(new APIError(ErrCode.InvalidArgument, 
            `File exceeds maximum size of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`));
        }
        
        // Validate file upload
        if (!fileData) {
          return reject(new APIError(ErrCode.InvalidArgument, "No file uploaded"));
        }
        
        // Validate required fields
        validateRequiredFields(formData);
        
        // Save certification
        const certification = await saveCertification(fileData, formData, expertId);
        
        // Return minimal data
        resolve({
          id: certification.id,
          certificate_file_url: certification.certificate_file_url,
          name: certification.name
        });
      } catch (error) {
        reject(error);
      }
    });
    
    // Handle errors
    bb.on("error", (err: Error) => {
      logger.error(err, "Error during file upload");
      reject(new APIError(ErrCode.Internal, `Upload error: ${err.message}`));
    });
    
    // Start processing
    req.pipe(bb);
  });
}

/**
 * Validate required form fields and throw error if invalid
 */
function validateRequiredFields(formData: Record<string, string>): void {
  const requiredFields = ["name", "issuer", "year"];
  const missingField = requiredFields.find(field => !formData[field]);
  
  if (missingField) {
    throw new APIError(ErrCode.InvalidArgument, `Field ${missingField} is required`);
  }
}

/**
 * Handle upload errors and send appropriate response
 */
function handleUploadError(error: any, res: ServerResponse): void {
  if (error instanceof APIError) {
    const status = getStatusFromErrorCode(error.code);
    logger.warn(`Validation error: ${error.message}`, { code: error.code });
    
    sendJsonResponse(res, status, {
      success: false,
      message: error.message
    });
  } else {
    logger.error(error, "Unexpected error in certification upload");
    
    sendJsonResponse(res, 500, {
      success: false,
      message: "Internal server error"
    });
  }
}

/**
 * Map error codes to HTTP status codes
 */
function getStatusFromErrorCode(code: string): number {
  switch (code) {
    case 'invalid_argument':
      return 400;
    case 'permission_denied':
      return 403;
    case 'not_found':
      return 404;
    default:
      return 500;
  }
}

/**
 * Save certification to storage and database
 */
async function saveCertification(
  fileData: UploadedFile, 
  formData: Record<string, string>, 
  expertId: number
) {
  const fileExtension = fileData.mimetype.split('/')[1];
  const sanitizedName = formData.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
  const uniqueFileName = `expert_${expertId}_${sanitizedName}_${Date.now()}.${fileExtension}`;
  
  // Upload to bucket with proper content type
  await certificateFiles.upload(uniqueFileName, fileData.buffer, {
    contentType: fileData.mimetype
  });
  
  // Save to database
  const [certification] = await db.insert(expertCertifications).values({
    expert_id: expertId,
    name: formData.name,
    issuer: formData.issuer,
    year: formData.year,
    expiry_date: formData.expiry_date ? new Date(formData.expiry_date) : undefined,
    certificate_file_url: uniqueFileName,
  }).returning();
  
  return certification;
}

/**
 * Validates if the file type is allowed for certification uploads
 */
function isValidFileType(mimetype: string): boolean {
  return ALLOWED_FILE_TYPES.includes(mimetype);
} 