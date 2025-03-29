import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { experts } from "./experts.schema";

export const WithdrawalStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    REJECTED: 'rejected',
} as const;

export type WithdrawalStatus = (typeof WithdrawalStatus)[keyof typeof WithdrawalStatus];

export const withdrawals = pgTable("withdrawals", {
    id: serial("id").primaryKey(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    amount: integer("amount").notNull(),
    status: text("status").$type<WithdrawalStatus>().notNull().default(WithdrawalStatus.PENDING),
    bank_account: text("bank_account").notNull(),
    bank_name: text("bank_name").notNull(),
    account_holder: text("account_holder").notNull(),
    notes: text("notes"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
    expert: one(experts, {
        fields: [withdrawals.expert_id],
        references: [experts.id]
    }),
}));

export type Withdrawal = typeof withdrawals.$inferSelect;
