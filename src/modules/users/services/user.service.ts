import { userRoles } from "../../../database/schemas/user_roles.shema";
import { db } from "../../../database/drizzle";
import { users } from "../../../database/schemas/users.schema";
import { eq } from "drizzle-orm";
import { ProfileResponse } from "../interfaces/profile.interface";

export const userService = {
    getUser: async (id: number): Promise<ProfileResponse | null> => {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
            with: {
                userRoles: {
                    with: {
                        role: true,
                    },
                },
            },
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles: user?.userRoles.map((userRole) => userRole.role?.name ?? ''),
        };
    },
    assignRole: async (userId: number, roleId: number): Promise<void> => {
        await db.insert(userRoles).values({
            userId,
            roleId,
        });
    }
}