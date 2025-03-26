import { pgTable, serial, text, timestamp, integer, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./roles.schema";
import { experts } from "./experts.schema";
import { appointments } from "./appointments.schema";
import { payments } from "./payments.schema";
import { feedback } from "./feedback.schema";
import { blogPosts } from "./blog-posts.schema";
import { userProfiles } from "./user-profile.schema";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    roleId: integer("role_id").references(() => roles.id).notNull(),
    email_verified: boolean("email_verified").default(false),
    account_status: text("account_status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRolesRelations = relations(users, ({ one }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
    expert: one(experts),
    profile: one(userProfiles),
    appointments: many(appointments),
    payments: many(payments),
    feedback: many(feedback),
    blogPosts: many(blogPosts)
}));

export type User = typeof users.$inferSelect;




