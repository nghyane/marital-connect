import { integer, pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { relations } from "drizzle-orm";

export const experts = pgTable("experts", {
    id: serial().primaryKey(),
    user_id: integer().references(() => users.id),
    qualification: text(),
    experience: text(),
    consultation_fee: integer(),
    schedule: jsonb(),
});

export type Expert = typeof experts.$inferSelect;

export const expertsRelations = relations(experts, ({ one }) => ({
    user: one(users, {
        fields: [experts.user_id],
        references: [users.id],
    }),
}));
