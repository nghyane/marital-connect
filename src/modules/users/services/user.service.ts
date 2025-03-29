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
    },

    updateUser: async (userId: number, updateData: {
        name?: string;
        bio?: string;
        phone?: string;
        address?: string;
        city?: string;
        state?: string;
        country?: string;
        postal_code?: string;
    }) => {
        // Update user name if provided
        if (updateData.name) {
            await db.update(users).set({
                name: updateData.name,
                updatedAt: new Date(),
            }).where(eq(users.id, userId));
        }

        // Update profile fields
        const profileUpdateData: Record<string, any> = {};
        
        if (updateData.bio !== undefined) profileUpdateData.bio = updateData.bio;
        if (updateData.phone !== undefined) profileUpdateData.phone = updateData.phone;
        if (updateData.address !== undefined) profileUpdateData.address = updateData.address;
        if (updateData.city !== undefined) profileUpdateData.city = updateData.city;
        if (updateData.state !== undefined) profileUpdateData.state = updateData.state;
        if (updateData.country !== undefined) profileUpdateData.country = updateData.country;
        if (updateData.postal_code !== undefined) profileUpdateData.postal_code = updateData.postal_code;
        
        // Only update profile if there are profile fields to update
        if (Object.keys(profileUpdateData).length > 0) {
            // Check if profile exists
            const profile = await db.query.userProfiles.findFirst({
                where: eq(userProfiles.user_id, userId),
            });
            
            if (profile) {
                // Update existing profile
                await db.update(userProfiles)
                    .set(profileUpdateData)
                    .where(eq(userProfiles.user_id, userId));
            } else {
                // Create new profile
                await db.insert(userProfiles).values({
                    user_id: userId,
                    ...profileUpdateData,
                });
            }
        }
        
        // Return updated user
        return await userService.getUser(userId);
    }
}