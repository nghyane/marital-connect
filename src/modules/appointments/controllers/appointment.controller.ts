import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { appointmentService } from "../services/appointment.service";
import { 
    AppointmentResponse, 
    AppointmentsResponse, 
    CreateAppointmentRequest, 
    UpdateAppointmentStatusRequest,
    AppointmentAvailabilityRequest,
    AppointmentAvailabilityResponse
} from "../interfaces/appointment.interface";

import { db } from "../../../database/drizzle";
import { experts } from "../../../database/schemas/experts.schema";
import { eq } from "drizzle-orm";

// Create a new appointment  
export const createAppointment = api<CreateAppointmentRequest, AppointmentResponse>(
    {
        expose: true,
        auth: true,
        method: "POST",
        path: "/appointments",
    },
    async (req) => {
        const userID = Number(getAuthData()!.userID);

        const appointment = await appointmentService.createAppointment({
            ...req,
            user_id: userID,
        });
        
        return {
            success: true,
            data: appointment
        };
    }
);

// Get appointment by ID
export const getAppointment = api<{ id: number }, AppointmentResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/appointments/:id",
    },
    async (req) => {
        const userID = Number(getAuthData()!.userID);
        const appointment = await appointmentService.getAppointmentById(req.id);
        
        // Check if the user is authorized to view this appointment
        if (appointment.user_id !== userID && appointment.expert?.user_id !== userID) {
            throw APIError.permissionDenied("You are not authorized to view this appointment");
        }
        
        return {
            success: true,
            data: appointment
        };
    }
);

// Get user's appointments
export const getUserAppointments = api<{}, AppointmentsResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/appointments/user",
    },
    async () => {
        const userID = Number(getAuthData()!.userID);
        const appointments = await appointmentService.getUserAppointments(userID);
        
        return {
            success: true,
            data: appointments
        };
    }
);

// Get expert's appointments
export const getExpertAppointments = api<{}, AppointmentsResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/appointments/expert",
    },
    async () => {
        const userID = Number(getAuthData()!.userID);
        
        // First, get the expert ID for this user
        const expertId = await getExpertIdForUser(userID);
        
        const appointments = await appointmentService.getExpertAppointments(expertId);
        
        return {
            success: true,
            data: appointments
        };
    }
);

// Update appointment status (for experts)
export const updateAppointmentStatus = api<{ id: number } & UpdateAppointmentStatusRequest, AppointmentResponse>(
    {
        expose: true,
        auth: true,
        method: "PATCH",
        path: "/appointments/:id/status",
    },
    async (req) => {
        const userID = Number(getAuthData()!.userID);
        
        // Get the appointment
        const appointment = await appointmentService.getAppointmentById(req.id);
        
        // Check if the user is the expert for this appointment
        const expertId = await getExpertIdForUser(userID);
        if (appointment.expert_id !== expertId) {
            throw APIError.permissionDenied("Only the expert can update the appointment status");
        }
        
        // Update the status
        const updatedAppointment = await appointmentService.updateAppointmentStatus(req.id, req.status);
        
        return {
            success: true,
            data: updatedAppointment
        };
    }
);

// Cancel appointment (for users)
export const cancelAppointment = api<{ id: number }, AppointmentResponse>(
    {
        expose: true,
        auth: true,
        method: "POST",
        path: "/appointments/:id/cancel",
    },
    async (req) => {
        const userID = Number(getAuthData()!.userID);
        
        // Cancel the appointment
        const canceledAppointment = await appointmentService.cancelAppointment(req.id, userID);
        
        return {
            success: true,
            data: canceledAppointment
        };
    }
);

// Get expert availability
export const getExpertAvailability = api<AppointmentAvailabilityRequest, AppointmentAvailabilityResponse>(
    {
        expose: true,
        auth: true,
        method: "GET",
        path: "/appointments/availability",
    },
    async (req) => {
        const availability = await appointmentService.getExpertAvailabilityForService(req.expert_id, req.date, req.service_id);
        
        return {
            success: true,
            data: availability
        };
    }
);

async function getExpertIdForUser(userId: number): Promise<number> {
    // This is a placeholder - you would need to implement this based on your database structure
    // For example, query the experts table to find the expert with this user_id
    const expert = await db.query.experts.findFirst({
        where: eq(experts.user_id, userId)
    });
    
    if (!expert) {
        throw APIError.permissionDenied("You are not registered as an expert");
    }
    
    return expert.id;
} 