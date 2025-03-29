export interface PayosWebhookData {
    id: string;
    code: number;
    desc: string;
    clientId: string;
    orderId: string;
    amount: number;
    amountPaid: number;
    amountRemaining: number;
    status: PayosPaymentStatus;
    cancelUrl: string;
    returnUrl: string;
    signature: string;
    checkoutUrl: string;
    paymentLinkId: string;
    createdAt: string;
    expiredAt: string;
    canceledAt?: string;
    paidAt?: string;
}

export enum PayosPaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    PAID = 'PAID',
    CANCELED = 'CANCELED',
    EXPIRED = 'EXPIRED',
    FAILED = 'FAILED'
}

export interface PayosWebhookEvent {
    event: string;
    data: PayosWebhookData;
}

export interface PayosCreatePaymentRequest {
    orderCode: string;
    amount: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    signature: string;
}

export interface PayosCreatePaymentResponse {
    code: number;
    desc: string;
    data: {
        id: string;
        code: number;
        desc: string;
        clientId: string;
        orderId: string;
        amount: number;
        amountPaid: number;
        amountRemaining: number;
        status: PayosPaymentStatus;
        cancelUrl: string;
        returnUrl: string;
        signature: string;
        checkoutUrl: string;
        paymentLinkId: string;
        createdAt: string;
        expiredAt: string;
    }
}

export interface PayosWebhookPayloadData {
    orderCode: number;
    amount: number;
    description: string;
    accountNumber: string;
    reference: string;
    transactionDateTime: string;
    paymentLinkId: string;
    code: string;
    desc: string;
    counterAccountBankId: string;
    counterAccountBankName: string;
    counterAccountName: string | null;
    counterAccountNumber: string | null;
    virtualAccountName: string;
    virtualAccountNumber: string;
    currency: string;
}

export interface PayosWebhookPayload {
    code: string;
    desc: string;
    success: boolean;
    data: PayosWebhookPayloadData;
    signature: string;
} 