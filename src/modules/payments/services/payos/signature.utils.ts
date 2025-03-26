import { createHmac } from "crypto";
import { logger } from "../../../../shared/logger";
import { secret } from "encore.dev/config";

const PAYOS_CHECKSUM_KEY = secret("PAYOS_CHECKSUM_KEY");

/**
 * Utility functions for handling PayOS signatures
 */
export const signatureUtils = {
    /**
     * Sort object properties alphabetically by key
     */
    sortObjectByKey: <T extends Record<string, any>>(object: T): Record<string, any> => {
        return Object.keys(object)
            .sort()
            .reduce((obj, key) => {
                obj[key] = object[key];
                return obj;
            }, {} as Record<string, any>);
    },

    /**
     * Convert object to query string format for signature generation
     */
    objectToQueryString: (object: Record<string, any>): string => {
        return Object.keys(object)
            .filter(key => object[key] !== undefined)
            .map(key => {
                let value = object[key];
                
                // Handle array values
                if (value && Array.isArray(value)) {
                    value = JSON.stringify(value.map(val => 
                        typeof val === 'object' ? signatureUtils.sortObjectByKey(val) : val
                    ));
                }
                
                // Handle null/undefined values
                if ([null, undefined, "undefined", "null"].includes(value)) {
                    value = "";
                }

                return `${key}=${value}`;
            })
            .join("&");
    },

    /**
     * Create HMAC SHA-256 signature from data object
     */
    createSignature: (data: Record<string, any>, secretKey: string): string => {
        const sortedData = signatureUtils.sortObjectByKey(data);
        const queryString = signatureUtils.objectToQueryString(sortedData);
        
        return createHmac("sha256", secretKey)
            .update(queryString)
            .digest("hex");
    },

    /**
     * Verify webhook signature against provided signature
     */
    verifySignature: (data: Record<string, any>, signature: string): boolean => {
        try {
            const calculatedSignature = signatureUtils.createSignature(data, PAYOS_CHECKSUM_KEY());
            
            logger.debug('Signature verification', {
                calculatedSignature,
                providedSignature: signature
            });
            
            return calculatedSignature === signature;
        } catch (error) {
            logger.error(error, 'Error verifying webhook signature');
            return false;
        }
    }
}; 