import { db } from "../../../database/drizzle";
import { users } from "../../../database/schemas/users.schema";
import { userProfiles } from "../../../database/schemas/user-profile.schema";
import { eq } from "drizzle-orm";
import { PublicUser } from "../interfaces/profile.interface";

type UserWithRole = typeof users.$inferSelect & {
    role: { 
        name: string 
    },
    profile: typeof userProfiles.$inferSelect
};

export const userService = {
    getUser: async (id: number) => {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                account_status: true,
                email_verified: true,
            },
            with: {
                role: {
                    columns: {
                        name: true,
                    },
                },
                profile: true,
            },
        }) as UserWithRole;

        if (!user) {
            return null;
        }


        return user;
    },
    
    assignRole: async (userId: number, roleId: number): Promise<void> => {
        await db.update(users).set({
            roleId,
        }).where(eq(users.id, userId));
    }
}