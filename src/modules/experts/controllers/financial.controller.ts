import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { logger } from "../../../shared/logger";
import { apiResponse } from "../../../shared/api-response";
import { financialService } from "../services/financial.service";
import { 
    ExpertFinancialResponse, 
    CreateWithdrawalRequest, 
    CreateWithdrawalResponse, 
    WithdrawalHistoryResponse,
    WithdrawalDetailsRequest,
    WithdrawalDetailsResponse
} from "../interfaces/financial.interface";
import { db } from "../../../database/drizzle";
import { experts } from "../../../database/schemas/experts.schema";
import { eq } from "drizzle-orm";

/**
 * Get expert's financial information, including:
 * - Total Balance
 * - Available for Withdrawal
 * - Pending Withdrawals
 */
export const getFinancialInfo = api<{}, ExpertFinancialResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/experts/financial",
    },
    async () => {
        try {
            const userID = Number(getAuthData()!.userID);
            
            if (!userID) {
                throw APIError.unauthenticated("User not authenticated");
            }
            
            // Get expert ID for this user
            const expert = await db.query.experts.findFirst({
                where: eq(experts.user_id, userID)
            });
            
            if (!expert) {
                throw APIError.permissionDenied("You are not registered as an expert");
            }
            
            const expertId = expert.id;
            
            // Get all financial information in a single optimized call
            const financialInfo = await financialService.getExpertFinancialSummary(expertId);
            
            logger.info("Retrieved expert financial info", { 
                expertId, 
                ...financialInfo
            });
            
            return apiResponse.success(financialInfo, "Financial information retrieved successfully");
        } catch (error) {
            logger.error(error, "Error retrieving financial information");
            throw error;
        }
    }
);

/**
 * Create a new withdrawal request
 */
export const createWithdrawal = api<CreateWithdrawalRequest, CreateWithdrawalResponse>(
    {
        expose: true,
        auth: true,
        method: "POST",
        path: "/experts/withdrawals",
    },
    async (req) => {
        try {
            const userID = Number(getAuthData()!.userID);
            
            if (!userID) {
                throw APIError.unauthenticated("User not authenticated");
            }
            
            // Get expert ID for this user
            const expert = await db.query.experts.findFirst({
                where: eq(experts.user_id, userID)
            });
            
            if (!expert) {
                throw APIError.permissionDenied("You are not registered as an expert");
            }
            
            const expertId = expert.id;
            
            // Create the withdrawal
            const withdrawal = await financialService.createWithdrawal(expertId, req);
            
            logger.info("Created withdrawal request", { 
                expertId, 
                withdrawalId: withdrawal.id,
                amount: withdrawal.amount
            });
            
            return apiResponse.success(withdrawal, "Withdrawal request created successfully");
        } catch (error) {
            logger.error(error, "Error creating withdrawal request");
            throw error;
        }
    }
);

/**
 * Get withdrawal history
 */
export const getWithdrawalHistory = api<{}, WithdrawalHistoryResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/experts/withdrawals",
    },
    async () => {
        try {
            const userID = Number(getAuthData()!.userID);
            
            if (!userID) {
                throw APIError.unauthenticated("User not authenticated");
            }
            
            // Get expert ID for this user
            const expert = await db.query.experts.findFirst({
                where: eq(experts.user_id, userID)
            });
            
            if (!expert) {
                throw APIError.permissionDenied("You are not registered as an expert");
            }
            
            const expertId = expert.id;
            
            // Get withdrawal history
            const withdrawals = await financialService.getWithdrawalHistory(expertId);
            
            logger.info("Retrieved withdrawal history", { 
                expertId, 
                count: withdrawals.length 
            });
            
            return apiResponse.success({ withdrawals }, "Withdrawal history retrieved successfully");
        } catch (error) {
            logger.error(error, "Error retrieving withdrawal history");
            throw error;
        }
    }
);

/**
 * Lấy chi tiết một yêu cầu rút tiền
 */
export const getWithdrawalDetails = api<WithdrawalDetailsRequest, WithdrawalDetailsResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/experts/withdrawals/:id",
    },
    async (req) => {
        try {
            const userID = Number(getAuthData()!.userID);
            const { id } = req;
            
            if (!userID) {
                throw APIError.unauthenticated("User not authenticated");
            }
            
            // Get expert ID for this user
            const expert = await db.query.experts.findFirst({
                where: eq(experts.user_id, userID)
            });
            
            if (!expert) {
                throw APIError.permissionDenied("You are not registered as an expert");
            }
            
            // Get withdrawal details
            const withdrawal = await financialService.getWithdrawalById(Number(id), expert.id);
            
            logger.info("Retrieved withdrawal details", { 
                expertId: expert.id, 
                withdrawalId: id
            });
            
            return apiResponse.success(withdrawal, "Withdrawal details retrieved successfully");
        } catch (error) {
            logger.error(error, "Error retrieving withdrawal details");
            throw error;
        }
    }
); 