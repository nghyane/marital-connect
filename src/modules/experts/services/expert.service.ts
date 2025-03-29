import { db } from "../../../database/drizzle";
import { experts, Expert } from "../../../database/schemas/experts.schema";
import { eq, and, ilike, sql, gte, inArray, desc } from "drizzle-orm";
import { ExpertsFilter } from "../interfaces/expert.interface";
import { users } from "../../../database/schemas/users.schema";
import { expertEducation } from "../../../database/schemas/expert-education.schema";
import { expertCertifications, CertificationVerificationStatus } from "../../../database/schemas/expert-certifications.schema";
import { expertServices } from "../../../database/schemas/expert-services.schema";
import { appointments } from "../../../database/schemas/appointments.schema";
import { APIError } from "encore.dev/api";


// Định nghĩa kiểu dữ liệu cho expert với các quan hệ
interface ExpertWithRelations extends Expert {
    education?: any[];
    certifications?: any[];
    services?: any[];
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

// Helper function to map certification data
function mapCertifications(certifications: any[]): any[] {
    return certifications.map(cert => ({
        ...cert,
        verification_status: cert.verification_status as CertificationVerificationStatus
    }));
}

export const expertService = {
    getAllExperts: async (filter?: ExpertsFilter) => {
        const conditions = [];

        if (filter?.name) {
            conditions.push(ilike(users.name, `%${filter.name}%`));
        }

        if (filter?.location) {
            conditions.push(ilike(experts.location, `%${filter.location}%`));
        }

        if (filter?.title) {
            conditions.push(ilike(experts.title, `%${filter.title}%`));
        }

        if (filter?.specialties && filter.specialties.length > 0) {
            conditions.push(sql`${experts.specialties} ?| ${filter.specialties}`);
        }

        if (filter?.experience) {
            conditions.push(gte(experts.experience, filter.experience));
        }

        if (filter?.availability_status) {
            conditions.push(eq(experts.availability_status, filter.availability_status));
        }


        // Lấy danh sách ID của các chuyên gia phù hợp với điều kiện lọc
        const expertsQuery = db.select({
            id: experts.id,
            user_id: experts.user_id,
            about: experts.about,
            title: experts.title,
            location: experts.location,
            experience: experts.experience,
            specialties: experts.specialties,
            availability_status: experts.availability_status,
            user: {
                name: users.name,
                email: users.email,
            },
        })
        .from(experts)
        .innerJoin(users, eq(experts.user_id, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined);

        // Lấy tất cả dữ liệu liên quan trong một lần truy vấn
        const [expertsWithUsers, allEducation, allCertifications, allServices] = await Promise.all([
            expertsQuery,
            db.select()
                .from(expertEducation)
                .where(inArray(
                    expertEducation.expert_id, 
                    db.select({ id: experts.id })
                      .from(experts)
                      .where(conditions.length > 0 ? and(...conditions) : undefined)
                )),
            db.select()
                .from(expertCertifications)
                .where(inArray(
                    expertCertifications.expert_id, 
                    db.select({ id: experts.id })
                      .from(experts)
                    
                      .where(conditions.length > 0 ? and(...conditions) : undefined)
                )),
            db.select()
                .from(expertServices)
                .where(inArray(
                    expertServices.expert_id, 
                    db.select({ id: experts.id })
                      .from(experts)
                      .where(conditions.length > 0 ? and(...conditions) : undefined)
                ))
        ]);

        // Nhóm dữ liệu liên quan theo expert_id
        const educationByExpertId = groupBy(allEducation, 'expert_id');
        const certificationsByExpertId = groupBy(allCertifications, 'expert_id');
        const servicesByExpertId = groupBy(allServices, 'expert_id');

        // Kết hợp dữ liệu
        return expertsWithUsers.map(expert => ({
            ...expert,
            education: educationByExpertId[expert.id] || [],
            certifications: mapCertifications(certificationsByExpertId[expert.id] || []),
            services: servicesByExpertId[expert.id] || []
        }));
    },

    getExpertByUserId: async (userId: number, approvedCertifications: boolean = true): Promise<ExpertWithRelations | null> => {
        const expert = await db.query.experts.findFirst({
            where: eq(experts.user_id, userId),
            with: {
                education: true,
                certifications: approvedCertifications ? {
                    where: eq(expertCertifications.verification_status, CertificationVerificationStatus.APPROVED),
                    orderBy: [desc(expertCertifications.created_at)]
                } : true,
                services: true,
                user: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
            },
        });

        if (expert) {
            // Map certifications to ensure correct type for verification_status
            expert.certifications = mapCertifications(expert.certifications || []);
        }

        return expert as ExpertWithRelations | null;
    },


    createExpert: async (expert: Omit<Expert, "id">): Promise<Expert> => {
        try {
            const newExpert = await db.insert(experts).values(expert).returning();
            
            if (!newExpert.length) {
                throw new Error("Failed to create expert");
            }
            
            return newExpert[0];
        } catch (error) {
            console.error("Error creating expert:", error);
            throw error;
        }
    },

    getExpertClients: async (expertId: number) => {
        // Get current timestamp for comparing with future appointments
        const now = new Date();
        
        // First get all clients who have had appointments with this expert
        const clientsWithAppointments = await db
            .selectDistinct({
                user_id: appointments.user_id,
                name: users.name,
                email: users.email,
                account_status: users.account_status,
                last_appointment: sql<string>`MAX(CASE WHEN ${appointments.scheduled_time} < NOW() THEN ${appointments.scheduled_time} ELSE NULL END)`,
                appointment_count: sql<number>`COUNT(${appointments.id})`,
            })
            .from(appointments)
            .innerJoin(users, eq(appointments.user_id, users.id))
            .where(eq(appointments.expert_id, expertId))
            .groupBy(appointments.user_id, users.name, users.email, users.account_status);

        // For each client, find their next upcoming appointment
        const clientsWithNextAppointments = await Promise.all(
            clientsWithAppointments.map(async (client) => {
                const nextAppointment = await db
                    .select({
                        scheduled_time: appointments.scheduled_time,
                        status: appointments.status,
                        service_id: appointments.service_id
                    })
                    .from(appointments)
                    .where(
                        and(
                            eq(appointments.expert_id, expertId),
                            eq(appointments.user_id, client.user_id),
                            gte(appointments.scheduled_time, now)
                        )
                    )
                    .orderBy(appointments.scheduled_time)
                    .limit(1);

                return {
                    ...client,
                    next_appointment: nextAppointment.length > 0 ? nextAppointment[0].scheduled_time.toISOString() : null,
                    next_appointment_status: nextAppointment.length > 0 ? nextAppointment[0].status : null,
                    last_appointment: client.last_appointment ? new Date(client.last_appointment).toISOString() : null,
                };
            })
        );

        return clientsWithNextAppointments.sort((a, b) => {
            // Sort by next appointment if available
            if (a.next_appointment && b.next_appointment) {
                return new Date(a.next_appointment).getTime() - new Date(b.next_appointment).getTime();
            }
            // If only one has next appointment, prioritize that one
            if (a.next_appointment) return -1;
            if (b.next_appointment) return 1;
            // Otherwise sort by last appointment (most recent first)
            if (a.last_appointment && b.last_appointment) {
                return new Date(b.last_appointment).getTime() - new Date(a.last_appointment).getTime();
            }
            return 0;
        });
    },
    
    getClientDetails: async (expertId: number, clientId: number) => {
        // Check if this client has appointments with the expert
        const existingRelationship = await db
            .select({ count: sql<number>`COUNT(*)` })
            .from(appointments)
            .where(
                and(
                    eq(appointments.expert_id, expertId),
                    eq(appointments.user_id, clientId)
                )
            );
            
        if (existingRelationship[0].count === 0) {
            throw APIError.notFound("Client not found or has no relationship with this expert");
        }
        
        // Get client basic information
        const user = await db.query.users.findFirst({
            where: eq(users.id, clientId),
            columns: {
                id: true,
                name: true,
                email: true,
                account_status: true,
            },
            with: {
                profile: {
                    columns: {
                        bio: true,
                        phone: true,
                        address: true,
                        city: true,
                        state: true,
                        country: true,
                        profile_image: true,
                    }
                }
            }
        }) as any;
        
        if (!user) {
            throw APIError.notFound("Client not found");
        }
        
        // Get appointment history with this expert
        const appointmentHistory = await db
            .select({
                id: appointments.id,
                scheduled_time: appointments.scheduled_time,
                end_time: appointments.end_time,
                status: appointments.status,
                service_name: expertServices.name,
                price: expertServices.price,
            })
            .from(appointments)
            .innerJoin(expertServices, eq(appointments.service_id, expertServices.id))
            .where(
                and(
                    eq(appointments.expert_id, expertId),
                    eq(appointments.user_id, clientId)
                )
            )
            .orderBy(desc(appointments.scheduled_time));
            
        // Calculate appointment statistics
        const appointmentStats = await db
            .select({
                first_appointment: sql<string>`MIN(${appointments.scheduled_time})`,
                last_appointment: sql<string>`MAX(CASE WHEN ${appointments.scheduled_time} < NOW() THEN ${appointments.scheduled_time} ELSE NULL END)`,
                total_appointments: sql<number>`COUNT(*)`,
                total_spent: sql<number>`SUM(${expertServices.price})`,
            })
            .from(appointments)
            .innerJoin(expertServices, eq(appointments.service_id, expertServices.id))
            .where(
                and(
                    eq(appointments.expert_id, expertId),
                    eq(appointments.user_id, clientId)
                )
            );
            
        // Get next appointment if exists
        const nextAppointment = await db
            .select({
                scheduled_time: appointments.scheduled_time,
            })
            .from(appointments)
            .where(
                and(
                    eq(appointments.expert_id, expertId),
                    eq(appointments.user_id, clientId),
                    gte(appointments.scheduled_time, new Date())
                )
            )
            .orderBy(appointments.scheduled_time)
            .limit(1);
            
        return {
            user_id: user.id,
            name: user.name,
            email: user.email,
            account_status: user.account_status,
            profile: user.profile || undefined,
            appointments: appointmentHistory.map(appt => ({
                ...appt,
                scheduled_time: appt.scheduled_time.toISOString(),
                end_time: appt.end_time.toISOString(),
            })),
            first_appointment: appointmentStats[0].first_appointment 
                ? new Date(appointmentStats[0].first_appointment).toISOString() 
                : null,
            last_appointment: appointmentStats[0].last_appointment 
                ? new Date(appointmentStats[0].last_appointment).toISOString() 
                : null,
            next_appointment: nextAppointment.length > 0 
                ? nextAppointment[0].scheduled_time.toISOString() 
                : null,
            total_appointments: appointmentStats[0].total_appointments || 0,
            total_spent: appointmentStats[0].total_spent || 0
        };
    },

    updateExpertProfile: async (expertId: number, updateData: {
        title?: string;
        about?: string;
        location?: string;
        experience?: number;
        google_meet_link?: string | null;
        specialties?: string[];
        availability_status?: string;
    }) => {
        const updateFields: Record<string, any> = {};
        
        if (updateData.title !== undefined) updateFields.title = updateData.title;
        if (updateData.about !== undefined) updateFields.about = updateData.about;
        if (updateData.location !== undefined) updateFields.location = updateData.location;
        if (updateData.experience !== undefined) updateFields.experience = updateData.experience;
        if (updateData.google_meet_link !== undefined) updateFields.google_meet_link = updateData.google_meet_link;
        if (updateData.specialties !== undefined) updateFields.specialties = updateData.specialties;
        if (updateData.availability_status !== undefined) updateFields.availability_status = updateData.availability_status;
        
        // Only update if there are fields to update
        if (Object.keys(updateFields).length > 0) {
            await db.update(experts)
                .set(updateFields)
                .where(eq(experts.id, expertId));
        }
        
        // Return updated expert
        const updatedExpert = await expertService.getExpertByUserId(
            (await db.select({ user_id: experts.user_id })
                .from(experts)
                .where(eq(experts.id, expertId)))[0].user_id,
            false
        );
        
        if (!updatedExpert) {
            throw new Error("Failed to retrieve updated expert profile");
        }
        
        return updatedExpert;
    }
};

/**
 * Nhóm mảng các đối tượng theo một khóa cụ thể
 * @param array Mảng các đối tượng cần nhóm
 * @param key Tên thuộc tính dùng để nhóm
 * @returns Đối tượng với các khóa là giá trị của thuộc tính và giá trị là mảng các đối tượng có cùng giá trị khóa
 */
function groupBy<T extends Record<string, any>, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce((result: Record<string, T[]>, item: T) => {
        const keyValue = String(item[key]);
        (result[keyValue] = result[keyValue] || []).push(item);
        return result;
    }, {});
} 