import { api, APIError } from "encore.dev/api";
import { payosService } from "../services";
import { logger } from "../../../shared/logger";
import { getAuthData } from "~encore/auth";
import { CreatePaymentRequest, CreatePaymentResponse } from "../interfaces/index";

import { db } from "../../../database/drizzle";
import { appointments, users } from "../../../database/schemas";
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
            const amount = appointment.service.price * 1000;
            

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