import { db } from "../../../database/drizzle";
import { appointments, AppointmentStatus, Appointment } from "../../../database/schemas/appointments.schema";
import { expertAvailability, WeekDay } from "../../../database/schemas/expert-availability.schema";
import { expertServices } from "../../../database/schemas/expert-services.schema";
import { experts } from "../../../database/schemas/experts.schema";
import { users } from "../../../database/schemas/users.schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { APIError, ErrCode } from "encore.dev/api";
import { AppointmentWithRelations, TimeSlot } from "../interfaces/appointment.interface";

// Mapping of day index to WeekDay enum for better performance
const WEEKDAY_MAP: WeekDay[] = [
    WeekDay.SUNDAY,
    WeekDay.MONDAY,
    WeekDay.TUESDAY,
    WeekDay.WEDNESDAY,
    WeekDay.THURSDAY,
    WeekDay.FRIDAY,
    WeekDay.SATURDAY
];

// Helper function to convert day of week to WeekDay enum
const getDayOfWeek = (date: Date): WeekDay => WEEKDAY_MAP[date.getDay()];

// Helper function to parse time string (HH:MM:SS) to hours and minutes
const parseTimeString = (timeString: string): { hours: number; minutes: number } => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
};

// Helper function to check if two time ranges overlap
const doTimesOverlap = (
    start1: Date, 
    end1: Date, 
    start2: Date, 
    end2: Date
): boolean => {
    return start1 < end2 && end1 > start2;
};

// Helper function to find available time blocks between appointments
const findAvailableTimeBlocks = (
    startTime: Date,
    endTime: Date,
    appointments: Appointment[]
): Array<{ start: Date, end: Date }> => {
    if (appointments.length === 0) {
        return [{ start: startTime, end: endTime }];
    }

    const blocks: Array<{ start: Date, end: Date }> = [];
    let currentStart = new Date(startTime);

    // Sort appointments by start time
    const sortedAppointments = [...appointments].sort(
        (a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
    );

    // Find gaps between appointments
    for (const appointment of sortedAppointments) {
        const appointmentStart = new Date(appointment.scheduled_time);
        const appointmentEnd = new Date(appointment.end_time);

        // Skip appointments that end before our current start
        if (appointmentEnd <= currentStart) continue;
        
        // Skip appointments that start after our end time
        if (appointmentStart >= endTime) break;
        
        // If there's a gap before this appointment, add it as an available block
        if (appointmentStart > currentStart) {
            blocks.push({ start: currentStart, end: appointmentStart });
        }

        // Move current start to after this appointment
        currentStart = new Date(Math.max(currentStart.getTime(), appointmentEnd.getTime()));
    }

    // Add final block if there's time left
    if (currentStart < endTime) {
        blocks.push({ start: currentStart, end: endTime });
    }

    return blocks;
};

// Helper function to validate expert, service, and user existence
const validateEntities = async (
    expertId: number,
    serviceId: number,
): Promise<{ expertExists: boolean; serviceExists: boolean; userExists?: boolean }> => {
    // Run queries in parallel for better performance
    const [expertExists, serviceExists] = await Promise.all([
        db.query.experts.findFirst({
            where: eq(experts.id, expertId)
        }),
        db.query.expertServices.findFirst({
            where: and(
                eq(expertServices.id, serviceId),
                eq(expertServices.expert_id, expertId)
            )
        })
    ]);

    return {
        expertExists: !!expertExists,
        serviceExists: !!serviceExists,
    };
};

// Helper function to get service duration in minutes
const getServiceDuration = (durationString: string): number => {
    return parseInt(durationString.replace('min', ''));
};

// Helper function to create time slots from available blocks
const createTimeSlotsFromBlocks = (
    blocks: Array<{ start: Date; end: Date }>,
    serviceDuration: number,
    interval: number = 30
): TimeSlot[] => {
    const timeSlots: TimeSlot[] = [];

    for (const block of blocks) {
        const blockStart = new Date(block.start);
        const blockEnd = new Date(block.end);
        const blockDuration = (blockEnd.getTime() - blockStart.getTime()) / (60 * 1000);

        // Skip if block is too short for the service
        if (blockDuration < serviceDuration) {
            continue;
        }

        // Create slots at specified intervals
        const currentTime = new Date(blockStart);
        while (true) {
            const slotStart = new Date(currentTime);
            const slotEnd = new Date(currentTime);
            slotEnd.setMinutes(slotEnd.getMinutes() + serviceDuration);

            // Stop if we can't fit the service duration
            if (slotEnd > blockEnd) {
                break;
            }

            timeSlots.push({
                start_time: slotStart.toISOString(),
                end_time: slotEnd.toISOString(),
                is_available: true,
                duration: serviceDuration
            });

            // Move to next slot
            currentTime.setMinutes(currentTime.getMinutes() + interval);
        }
    }

    return timeSlots;
};

export const appointmentService = {
    // Create a new appointment
    async createAppointment(data: {
        expert_id: number;
        user_id: number;
        service_id: number;
        scheduled_time: string;
        end_time: string;
        notes?: string;
    }): Promise<AppointmentWithRelations> {
        // Validate entities in parallel
        const { expertExists, serviceExists } = await validateEntities(
            data.expert_id,
            data.service_id,
        );

        if (!expertExists) {
            throw APIError.notFound("Expert not found");
        }

        if (!serviceExists) {
            throw APIError.notFound("Service not found or does not belong to this expert");
        }

        // Parse dates once
        const scheduledTime = new Date(data.scheduled_time);
        const endTime = new Date(data.end_time);

        // Check if the expert is available at this time
        const dayOfWeek = getDayOfWeek(scheduledTime);
        const timeOfDay = scheduledTime.toTimeString().split(' ')[0]; // HH:MM:SS

        const expertIsAvailable = await db.query.expertAvailability.findFirst({
            where: and(
                eq(expertAvailability.expert_id, data.expert_id),
                eq(expertAvailability.day_of_week, dayOfWeek),
                sql`${expertAvailability.start_time} <= ${timeOfDay}::time`,
                sql`${expertAvailability.end_time} >= ${timeOfDay}::time`,
                eq(expertAvailability.is_available, true)
            )
        });

        if (!expertIsAvailable) {
            throw APIError.failedPrecondition("Expert is not available at this time");
        }

        // Optimize the overlapping appointments query
        const overlappingAppointments = await db.query.appointments.findMany({
            where: and(
                eq(appointments.expert_id, data.expert_id),
                sql`
                    (${appointments.scheduled_time} < ${endTime.toISOString()}::timestamp AND 
                     ${appointments.end_time} > ${scheduledTime.toISOString()}::timestamp)
                `,
                sql`${appointments.status} != ${AppointmentStatus.CANCELED}`
            )
        });

        if (overlappingAppointments.length > 0) {
            throw APIError.failedPrecondition("This time slot is already booked");
        }

        // Create the appointment
        const [newAppointment] = await db.insert(appointments).values({
            expert_id: data.expert_id,
            user_id: data.user_id,
            service_id: data.service_id,
            scheduled_time: scheduledTime,
            end_time: endTime,
            notes: data.notes,
            status: AppointmentStatus.PENDING
        }).returning();

        // Return the appointment with relations
        return await this.getAppointmentById(newAppointment.id);
    },

    // Get appointment by ID with relations
    async getAppointmentById(id: number): Promise<AppointmentWithRelations> {
        const appointment = await db.query.appointments.findFirst({
            where: eq(appointments.id, id),
            with: {
                expert: true,
                user: true,
                service: true
            }
        });

        if (!appointment) {
            throw APIError.notFound("Appointment not found");
        }

        return appointment;
    },

    // Get appointments for a user
    async getUserAppointments(userId: number, date?: string): Promise<AppointmentWithRelations[]> {
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            
            return await db.query.appointments.findMany({
                where: and(
                    eq(appointments.user_id, userId),
                    gte(appointments.scheduled_time, startOfDay),
                    lte(appointments.scheduled_time, endOfDay)
                ),
                with: {
                    expert: true,
                    service: true
                },
                orderBy: (appts, { desc }) => [desc(appts.scheduled_time)]
            });
        }
        
        return await db.query.appointments.findMany({
            where: eq(appointments.user_id, userId),
            with: {
                expert: true,
                service: true
            },
            orderBy: (appts, { desc }) => [desc(appts.scheduled_time)]
        });
    },

    // Get appointments for an expert
    async getExpertAppointments(expertId: number, date?: string): Promise<AppointmentWithRelations[]> {
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            
            return await db.query.appointments.findMany({
                where: and(
                    eq(appointments.expert_id, expertId),
                    gte(appointments.scheduled_time, startOfDay),
                    lte(appointments.scheduled_time, endOfDay)
                ),
                with: {
                    user: true,
                    service: true,
                    expert: true
                },
                orderBy: (appts, { desc }) => [desc(appts.scheduled_time)]
            });
        }
        
        return await db.query.appointments.findMany({
            where: eq(appointments.expert_id, expertId),
            with: {
                user: true,
                service: true,
                expert: true
            },
            orderBy: (appts, { desc }) => [desc(appts.scheduled_time)]
        });
    },

    // Update appointment status
    async updateAppointmentStatus(id: number, status: AppointmentStatus): Promise<AppointmentWithRelations> {
        const appointment = await db.query.appointments.findFirst({
            where: eq(appointments.id, id)
        });

        if (!appointment) {
            throw APIError.notFound("Appointment not found");
        }

        // Update the status
        await db.update(appointments)
            .set({
                status,
                updated_at: new Date()
            })
            .where(eq(appointments.id, id));

        // Return the updated appointment with relations
        return await this.getAppointmentById(id);
    },

    // Cancel an appointment
    async cancelAppointment(id: number, userId: number): Promise<AppointmentWithRelations> {
        const appointment = await db.query.appointments.findFirst({
            where: eq(appointments.id, id)
        });

        if (!appointment) {
            throw APIError.notFound("Appointment not found");
        }

        // Check if the user is authorized to cancel this appointment
        if (appointment.user_id !== userId) {
            throw APIError.permissionDenied("You are not authorized to cancel this appointment");
        }

        // Check if the appointment can be canceled (not already completed or canceled)
        if (appointment.status === AppointmentStatus.COMPLETED ||
            appointment.status === AppointmentStatus.CANCELED) {
            throw APIError.failedPrecondition(`Cannot cancel an appointment that is already ${appointment.status}`);
        }

        // Update the status to canceled
        await db.update(appointments)
            .set({
                status: AppointmentStatus.CANCELED,
                updated_at: new Date()
            })
            .where(eq(appointments.id, id));

        // Return the updated appointment with relations
        return await this.getAppointmentById(id);
    },

    // Get available time slots for an expert on a specific date for a specific service
    async getExpertAvailabilityForService(expertId: number, date: string, serviceId: number): Promise<{ date: string, time_slots: TimeSlot[] }> {
        // Validate expert and service in parallel
        const { expertExists, serviceExists } = await validateEntities(expertId, serviceId);

        if (!expertExists) {
            throw APIError.notFound("Expert not found");
        }

        if (!serviceExists) {
            throw APIError.notFound("Service not found or does not belong to this expert");
        }

        // Get service details
        const service = await db.query.expertServices.findFirst({
            where: and(
                eq(expertServices.id, serviceId),
                eq(expertServices.expert_id, expertId)
            )
        });

        if (!service) {
            throw APIError.notFound("Service not found");
        }

        // Parse duration from service
        const serviceDuration = getServiceDuration(service.duration);

        // Parse date once
        const selectedDate = new Date(date);
        const dayOfWeek = getDayOfWeek(selectedDate);

        // Get expert's availability for this day of week
        const availability = await db.query.expertAvailability.findMany({
            where: and(
                eq(expertAvailability.expert_id, expertId),
                eq(expertAvailability.day_of_week, dayOfWeek),
                eq(expertAvailability.is_available, true)
            )
        });

        if (availability.length === 0) {
            return {
                date,
                time_slots: []
            };
        }

        // Get all appointments for this expert on this date
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppointments = await db.query.appointments.findMany({
            where: and(
                eq(appointments.expert_id, expertId),
                gte(appointments.scheduled_time, startOfDay),
                lte(appointments.scheduled_time, endOfDay),
                sql`${appointments.status} != ${AppointmentStatus.CANCELED}`
            )
        });

        // Generate time slots based on expert's availability and existing appointments
        const timeSlots: TimeSlot[] = [];
        const now = new Date();

        // Process each availability block
        for (const slot of availability) {
            // Parse time strings once
            const { hours: startHours, minutes: startMinutes } = parseTimeString(slot.start_time);
            const { hours: endHours, minutes: endMinutes } = parseTimeString(slot.end_time);
            
            const startTime = new Date(selectedDate);
            startTime.setHours(startHours, startMinutes, 0, 0);

            const endTime = new Date(selectedDate);
            endTime.setHours(endHours, endMinutes, 0, 0);

            // Skip past time slots
            if (startTime < now) {
                const minutesSinceStart = Math.ceil((now.getTime() - startTime.getTime()) / (15 * 60 * 1000)) * 15;
                startTime.setTime(startTime.getTime() + minutesSinceStart * 60 * 1000);
            }

            // Find available time blocks
            const availableBlocks = findAvailableTimeBlocks(startTime, endTime, existingAppointments);
            
            // Create time slots from available blocks
            const slotsFromBlock = createTimeSlotsFromBlocks(availableBlocks, serviceDuration);
            timeSlots.push(...slotsFromBlock);
        }

        return {
            date,
            time_slots: timeSlots
        };
    },
}; 