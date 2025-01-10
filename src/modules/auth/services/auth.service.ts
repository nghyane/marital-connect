import { db } from "../../../database/drizzle";
import { users } from "../../../database/schemas/users.schema";
import { eq } from "drizzle-orm";
import { RegisterInsert } from "../interfaces/register.interface";
import { comparePassword, hashPassword } from "../../../shared/utils";
import { DEFAULT_ROLE_ID } from "../../../shared/constants";
export const authService = {
    login: async (email: string, password: string) => {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });
        
        if(!user || !comparePassword(password, user.password)) {
           return false;
        }

        return user;
    },
    
    register: async ({ email, password, name }: RegisterInsert) => {
        const user = await db.insert(users).values({
            email,
            password: hashPassword(password),
            name,
            roleId: DEFAULT_ROLE_ID,
        }).returning();

        if(user.length === 0) {
            return false;
        }

        return user[0];
    },
};



