import { db } from "../../../../database/drizzle";
import { payments, PaymentStatus } from "../../../../database/schemas/payments.schema";
import { PayosCreatePaymentRequest, PayosCreatePaymentResponse } from "../../interfaces";
import { logger } from "../../../../shared/logger";
import { APIError } from "encore.dev/api";
import { payos } from "./index";


// generate order code
const generateOrderCode = (): number => {
    // Tạo số ngẫu nhiên trong khoảng 100000-999999
    const randomPart = Math.floor(Math.random() * 900000) + 100000;
    
    // Lấy 3 chữ số cuối của timestamp hiện tại
    const timestampPart = Number(String(new Date().getTime()).slice(-3));
    
    // Kết hợp thành mã đơn hàng 9 chữ số
    return Number(`${randomPart}${timestampPart}`);
}

/**
 * Create a payment link for a transaction
 */
export const createPaymentLink = async (
    userId: number,
    expertId: number,
    appointmentId: number | null,
    amount: number,
    description: string,
    returnUrl: string,
    cancelUrl: string
) => {
    try {
        const orderCode = generateOrderCode();
        
        const responseData = await payos.createPaymentLink({
            orderCode,
            amount,
            description,
            cancelUrl,
            returnUrl,
        });
        
        logger.info("PayOS payment link created", {
            orderCode,
            amount,
            paymentLinkId: responseData.paymentLinkId
        });
        
        if (!responseData || !responseData.checkoutUrl) {
            console.log(responseData);


            throw APIError.internal("Failed to create PayOS payment link");
        }

        const [payment] = await db.insert(payments).values({
            user_id: userId,
            expert_id: expertId,
            appointment_id: appointmentId,
            amount,
            status: PaymentStatus.PENDING,
            payment_method: 'payos',
            payos_order_id: String(orderCode),
        }).returning();
        
        return {
            payment,
            checkoutUrl: responseData.checkoutUrl,
            paymentLinkId: responseData.paymentLinkId,
            qrCode: responseData.qrCode,
            accountNumber: responseData.accountNumber,
            accountName: responseData.accountName,
        };
    } catch (error) {
        logger.error(error, 'Error creating PayOS payment link');
        throw error;
    }
}; 
