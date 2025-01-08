import { db } from "../../../database/drizzle";
import { users } from "../../../database/schemas/users.schema";
import { eq } from "drizzle-orm";
import { RegisterInsert } from "../interfaces/register.interface";

export const authService = {
    login: async (email: string, password: string) => {
        const user = await db.select({
            id: users.id,
            email: users.email,
            password: users.password,
        }).from(users).where(eq(users.email, email));

        

        return user;
    },
    register: async ({ email, password, name }: RegisterInsert) => {
        const user = await db.insert(users).values({
            email,
            password,
            name,
        }).returning();

        return user.length > 0 ? user[0] : null;
    },
};



