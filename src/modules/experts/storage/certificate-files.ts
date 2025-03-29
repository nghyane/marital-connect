import { Bucket } from "encore.dev/storage/objects";

export const certificateFiles = new Bucket("certificate-files", {
    public: true, 
    versioned: false 
}); 