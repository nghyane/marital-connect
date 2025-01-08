import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./users.schema";
import { roles } from "./roles.schema";

export const userRoles = pgTable("user_roles", {
    userId: integer("user_id").references(() => users.id),
    roleId: integer("role_id").references(() => roles.id),
}, (t) => ([
    primaryKey({ columns: [t.userId, t.roleId] }),
]));

export type UserRole = typeof userRoles.$inferSelect;

export const userRolesRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
    }),
    role: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id],
    }),
}));


