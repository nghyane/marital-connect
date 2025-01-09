import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.schema";

export const roles = pgTable("roles", {
    id: serial("id").primaryKey(),
    name: text("name"),
});

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));

export type Role = typeof roles.$inferSelect;



