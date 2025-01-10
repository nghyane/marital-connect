import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./roles.schema";
import { experts } from "./experts.shema";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    roleId: integer("role_id").references(() => roles.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});



export const usersRolesRelations = relations(users, ({ one }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
}));

export const usersExpertsRelations = relations(users, ({ one }) => ({
    expert: one(experts, {
        fields: [users.id],
        references: [experts.user_id],
    }),
}));



export type User = typeof users.$inferSelect;




