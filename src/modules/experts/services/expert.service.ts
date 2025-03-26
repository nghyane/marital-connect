import { db } from "../../../database/drizzle";
import { experts, Expert } from "../../../database/schemas/experts.schema";
import { eq, and, ilike, sql, gte, inArray } from "drizzle-orm";
import { ExpertsFilter } from "../interfaces/expert.interface";
import { users } from "../../../database/schemas/users.schema";
import { expertEducation } from "../../../database/schemas/expert-education.schema";
import { expertCertifications } from "../../../database/schemas/expert-certifications.schema";
import { expertServices } from "../../../database/schemas/expert-services.schema";

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
            certifications: certificationsByExpertId[expert.id] || [],
            services: servicesByExpertId[expert.id] || []
        }));
    },

    getExpertByUserId: async (userId: number): Promise<ExpertWithRelations | null> => {
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