import { db } from "../../../database/drizzle";
import { experts, Expert } from "../../../database/schemas/experts.schema";
import { eq, and, ilike, sql, gte } from "drizzle-orm";
import { ExpertsFilter } from "../interfaces/expert.interface";
import { users } from "../../../database/schemas/users.schema";
import { expertEducation } from "../../../database/schemas/expert-education.schema";
import { expertCertifications } from "../../../database/schemas/expert-certifications.schema";
import { expertServices } from "../../../database/schemas/expert-services.schema";

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

        // First get the experts with user data
        const expertsWithUsers = await db.select({
            id: experts.id,
            user_id: experts.user_id,
            about: experts.about,
            title: experts.title,
            location: experts.location,
            experience: experts.experience,
            specialties: experts.specialties,
            availability_status: experts.availability_status,
            user: {
                id: users.id,
                name: users.name,
                email: users.email,
            },
        })
        .from(experts)
        .innerJoin(users, eq(experts.user_id, users.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined);

        // Then fetch related data separately for each expert
        const expertsWithRelations = await Promise.all(
            expertsWithUsers.map(async (expert) => {
                const [education, certifications, services] = await Promise.all([
                    db.select().from(expertEducation).where(eq(expertEducation.expert_id, expert.id)),
                    db.select().from(expertCertifications).where(eq(expertCertifications.expert_id, expert.id)),
                    db.select().from(expertServices).where(eq(expertServices.expert_id, expert.id))
                ]);

                return {
                    ...expert,
                    education,
                    certifications,
                    services
                };
            })
        );
        
        return expertsWithRelations;
    },

    getExpertByUserId: async (userId: number) => {
        const expert = await db.query.experts.findFirst({
            where: eq(experts.user_id, userId),
            with: {
                education: true,
                certifications: true,
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


        return expert;
    },

    createExpert: async (expert: Omit<Expert, "id">) => {
        const newExpert = await db.insert(experts).values(expert).returning();

        return newExpert[0];
    },

}; 