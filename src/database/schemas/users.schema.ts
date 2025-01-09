import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./roles.schema";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
    roles: many(roles),
}));

// typeof with non-ident not yet supported
// export type User = typeof users.$inferSelect;
export type User = {
    id: number;
    email: string;
    name: string;
    password: string;
    createdAt: Date | null;
    updatedAt: Date | null;
};





