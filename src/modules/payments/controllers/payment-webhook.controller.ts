import { api, APIError, ErrCode } from "encore.dev/api";
import { payosService } from "../services";
import { PayosWebhookPayload } from "../interfaces";
import { logger } from "../../../shared/logger";

interface WebhookResponse {
    success: boolean;
    message: string;
}

export const handlePayosWebhook = api<PayosWebhookPayload, WebhookResponse>(
    {
        expose: true,
        auth: false,
        method: "*",
        path: "/payments/webhook",
    },
    async (req) => {
        try {

            // Use the new method that directly handles the new payload structure
            const result = await payosService.handleWebhookPayload(req);
            
            return {
                success: result.success,
                message: result.message
            };
        } catch (error) {
            logger.error(error, "Error processing PayOS webhook");

            return {
                success: false,
                message: "Error processing webhook"
            };
        }
    }
); 

