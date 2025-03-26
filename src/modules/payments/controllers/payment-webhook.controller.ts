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
        method: "POST",
        path: "/payments/webhook/payos",
    },
    async (req) => {
        try {
            logger.info("Received PayOS webhook", { 
                success: req.payload.success,
                code: req.payload.code,
                orderCode: req.payload.data.orderCode,
                amount: req.payload.data.amount,
                description: req.payload.data.description
            });
            

            // Use the new method that directly handles the new payload structure
            const result = await payosService.handleWebhookPayload(req);
            
            return {
                success: result.success,
                message: result.message
            };
        } catch (error) {
            logger.error(error, "Error processing PayOS webhook");

            throw new APIError(ErrCode.Internal, "Error processing webhook");
        }
    }
); 