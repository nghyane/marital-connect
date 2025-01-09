import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userRoles } from "./user_roles.shema";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    userRoles: many(userRoles),
}));


export type User = typeof users.$inferSelect;




