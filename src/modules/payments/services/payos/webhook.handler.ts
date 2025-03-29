import { db } from "../../../../database/drizzle";
import { payments, PaymentStatus } from "../../../../database/schemas/payments.schema";
import { appointments, AppointmentStatus } from "../../../../database/schemas/appointments.schema";
import { eq } from "drizzle-orm";
import { PayosWebhookPayload } from "../../interfaces";
import { logger } from "../../../../shared/logger";
import { signatureUtils } from "./signature.utils";

/**
 * Handle webhook notifications from PayOS
 */
export const handleWebhookPayload = async (webhookPayload: PayosWebhookPayload) => {
    try {
        const { payload } = webhookPayload;
        const { data, signature } = payload;

        logger.info('Processing PayOS webhook', {
            code: payload.code,
            success: payload.success,
            orderCode: data.orderCode
        });
        
        // Verify webhook signature
        if (!signatureUtils.verifySignature(data, signature)) {
            logger.warn('Invalid webhook signature', { orderCode: data.orderCode });
            return { success: false, message: 'Invalid signature' };
        }

        // Convert orderCode to string for consistent comparison
        const orderCodeStr = String(data.orderCode);
        
        // Find payment by PayOS order ID
        const payment = await db.query.payments.findFirst({
            where: eq(payments.payos_order_id, orderCodeStr),
        });
        
        if (!payment) {
            logger.warn('Payment not found for webhook', { orderCode: orderCodeStr });
            return { success: false, message: 'Payment not found' };
        }
        
        // Check if payment is already processed to avoid duplicate processing
        if (payment.status === PaymentStatus.PAID) {
            logger.info('Payment already processed', { 
                paymentId: payment.id, 
                orderCode: orderCodeStr 
            });
            return { success: true, message: 'Payment already processed' };
        }
        
        // Determine payment status based on success flag and code
        const isSuccessful = payload.success && data.code === "00";
        const newStatus = isSuccessful ? PaymentStatus.PAID : PaymentStatus.FAILED;
        
        // Update payment status
        await db.update(payments)
            .set({ 
                status: newStatus,
                updated_at: new Date()
            })
            .where(eq(payments.id, payment.id));

        // Update appointment status
        await db.update(appointments)
            .set({ 
                status: AppointmentStatus.CONFIRMED,
            })
            .where(eq(appointments.id!, payment.appointment_id!));
        logger.info('Payment status updated', { 
            paymentId: payment.id, 
            orderCode: orderCodeStr, 
            status: newStatus 
        });
        
        return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
        logger.error(error, 'Error processing PayOS webhook');
        throw error;
    }
}; 