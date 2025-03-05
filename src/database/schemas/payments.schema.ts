import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { experts } from "./experts.schema";

export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id).notNull(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    amount: integer("amount").notNull(),
    status: text("status").notNull().default("pending"),
    payment_method: text("payment_method").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const paymentsRelations = relations(payments, ({ one }) => ({
    user: one(users, {
        fields: [payments.user_id],
        references: [users.id]
    }),
    expert: one(experts, {
        fields: [payments.expert_id],
        references: [experts.id]
    })
}));

export type Payment = typeof payments.$inferSelect;