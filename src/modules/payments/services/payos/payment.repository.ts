import { db } from "../../../../database/drizzle";
import { payments } from "../../../../database/schemas/payments.schema";
import { eq } from "drizzle-orm";

/**
 * Repository for payment data access
 */
export const paymentRepository = {
    /**
     * Get payment by ID
     */
    getPaymentById: async (paymentId: number) => {
        return db.query.payments.findFirst({
            where: eq(payments.id, paymentId),
        });
    },
    
    /**
     * Get payment by PayOS order ID
     */
    getPaymentByOrderId: async (orderId: string) => {
        return db.query.payments.findFirst({
            where: eq(payments.payos_order_id, orderId),
        });
    }
}; 