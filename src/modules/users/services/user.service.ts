import { db } from "../../../database/drizzle";
import { users } from "../../../database/schemas/users.schema";
import { eq } from "drizzle-orm";

export const userService = {
    getUser: async (id: number): Promise<any> => {
        const user = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            }
        });


        return user;
    }
}