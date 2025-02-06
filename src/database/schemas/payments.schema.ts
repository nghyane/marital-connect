import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id).notNull(),
    amount: integer("amount").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const paymentsRelations = relations(payments, ({ one }) => ({
    user: one(users, {
        fields: [payments.user_id],
        references: [users.id]
    })
}));

export type Payment = typeof payments.$inferSelect;