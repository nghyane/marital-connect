import { PayosPaymentStatus } from './payos.interface';

export * from './payos.interface'; 

export interface CreatePaymentRequest {
    appointmentId: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
}

export interface CreatePaymentResponse {
    success: boolean;
    message: string;
    data?: {
        paymentId: number;
        checkoutUrl: string;
    };
}

export interface GetPaymentHistoryResponse {
    success: boolean;
    message: string;
    data?: {
        payments: {
            id: number;
            amount: number;
            status: string;
            created_at: Date;
            appointment_id: number;
            payment_method: string;
            serviceName: string;
            expertName: string;
        }[];
    };
}

export interface PaymentReturnRequest {
    code: string;
    id: string;
    cancel: boolean;
    status: PayosPaymentStatus;
    orderCode: string;
}

export interface PaymentReturnResponse {
    success: boolean;
    message: string;
    data?: {
        paymentId: number;
    };
}