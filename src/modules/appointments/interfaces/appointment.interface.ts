import { Appointment, AppointmentStatus } from "../../../database/schemas/appointments.schema";

export interface CreateAppointmentRequest {
    expert_id: number;
    service_id: number;
    scheduled_time: string; // ISO string format
    end_time: string; // ISO string format
    notes?: string;
}

export interface UpdateAppointmentStatusRequest {
    status: 'pending' | 'confirmed' | 'canceled' | 'completed' | 'rescheduled';
}

export interface AppointmentWithRelations extends Appointment {
    expert?: any;
    user?: any;
    service?: any;
}

export interface AppointmentResponse {
    success: boolean;
    data: any;
}

export interface AppointmentsResponse {
    success: boolean;
    data: any;
}

export interface AppointmentAvailabilityRequest {
    expert_id: number;
    date: string; // ISO date string (YYYY-MM-DD)
    service_id: number;
}

export interface TimeSlot {
    start_time: string;
    end_time: string;
    is_available: boolean;
    duration: number; // Duration in minutes
}

export interface AppointmentAvailabilityResponse {
    success: boolean;
    data: {
        date: string;
        time_slots: TimeSlot[];
    };
} 