import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userRoles } from "./user_roles.shema";

export const roles = pgTable("roles", {
    id: serial("id").primaryKey(),
    name: text("name"),
});

export type Role = typeof roles.$inferSelect;

export const rolesRelations = relations(roles, ({ many }) => ({
    userRoles: many(userRoles),
}));


