import { db } from "../../../database/drizzle";
import { users } from "../../../database/schemas/users.schema";
import { eq } from "drizzle-orm";
import { ProfileResponse } from "../interfaces/profile.interface";

type UserWithRole = typeof users.$inferSelect & {
    role: { 
        name: string 
    }
};

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
                roleId: true,
            },
            with: {
                role: {
                    columns: {
                        name: true,
                    },
                },
            },
        }) as UserWithRole;

        if (!user) {
            return null;
        }


        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },
    assignRole: async (userId: number, roleId: number): Promise<void> => {
        await db.update(users).set({
            roleId,
        }).where(eq(users.id, userId));
    }
}