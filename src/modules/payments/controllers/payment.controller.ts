import { api, APIError } from "encore.dev/api";
import { payosService } from "../services";
import { logger } from "../../../shared/logger";
import { getAuthData } from "~encore/auth";
import { CreatePaymentRequest, CreatePaymentResponse, GetPaymentHistoryResponse } from "../interfaces/index";
import { PAYMENT_CONFIG } from "../config/payment.config";

import { db } from "../../../database/drizzle";
import { appointments, users, payments } from "../../../database/schemas";
import { eq } from "drizzle-orm";

export const createPaymentLink = api<CreatePaymentRequest, CreatePaymentResponse>(
    {
        expose: true,
        auth: true,
        method: "POST",
        path: "/payments/create",
    },
    async (params: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
        try {
            const userId = Number(getAuthData()!.userID);
            
            if (!userId) {
                throw APIError.unauthenticated("User not authenticated");
            }

            
            const {
                appointmentId,
                description,
                returnUrl,
                cancelUrl
            } = params;
            

            const appointment = await db.query.appointments.findFirst({
                where: eq(appointments.id, appointmentId!),
                with: {
                    service: true,
                    expert: true
                }
            });

            
            if (!appointment) {
                throw APIError.notFound("Appointment not found");
            }
            
            const expertId = appointment.expert.id;
            const amount = appointment.service.price * PAYMENT_CONFIG.PRICE_TO_CENTS_MULTIPLIER;
            

            const result = await payosService.createPaymentLink(
                userId,
                expertId,
                appointmentId,
                amount,
                description,
                returnUrl,
                cancelUrl
            );
            
            logger.info("Payment link created", { 
                userId, 
                expertId, 
                appointmentId, 
                paymentId: result.payment.id 
            });
            
            // Return a properly formatted response
            return {
                success: true,
                message: "Payment link created successfully",
                data: {
                    paymentId: result.payment.id,
                    checkoutUrl: result.checkoutUrl
                }
            };
        } catch (error) {
            logger.error(error, "Error creating payment link");
            
            if (error instanceof APIError) {
                throw error;
            }
            
            throw APIError.internal("Failed to create payment link");
        }
    }
); 

export const getPaymentHistory = api<{}, GetPaymentHistoryResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/payments/history",
    },
    async (): Promise<GetPaymentHistoryResponse> => {
        try {
            const userId = Number(getAuthData()!.userID);
            
            if (!userId) {
                throw APIError.unauthenticated("User not authenticated");
            }

            // Query payment history for the user
            const userPayments = await db.query.payments.findMany({
                where: eq(payments.user_id, userId),
                with: {
                    appointment: {
                        with: {
                            service: true,
                            expert: {
                                with: {
                                    user: true
                                }
                            }
                        }
                    }
                },
                orderBy: (payments, { desc }) => [desc(payments.created_at)]
            });
            
            logger.info("Retrieved payment history", { userId, count: userPayments.length });
            
            return {
                success: true,
                message: "Payment history retrieved successfully",
                data: {
                    payments: userPayments.map(payment => ({
                        id: payment.id,
                        amount: payment.amount / PAYMENT_CONFIG.PRICE_TO_CENTS_MULTIPLIER,
                        status: payment.status,
                        created_at: payment.created_at,
                        appointment_id: payment.appointment_id,
                        payment_method: payment.payment_method,
                        serviceName: payment.appointment?.service?.name || "",
                        expertName: payment.appointment?.expert?.user?.name || ""
                    }))
                }
            };
        } catch (error) {
            logger.error(error, "Error retrieving payment history");
            
            if (error instanceof APIError) {
                throw error;
            }
            
            throw APIError.internal("Failed to retrieve payment history");
        }
    }
);


