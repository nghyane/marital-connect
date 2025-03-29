import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { experts } from "./experts.schema";
import { appointments } from "./appointments.schema";

export const PaymentStatus = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    PAID: 'paid',
    CANCELED: 'canceled',
    EXPIRED: 'expired',
    FAILED: 'failed',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const payments = pgTable("payments", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id).notNull(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    appointment_id: integer("appointment_id").references(() => appointments.id).notNull(),
    amount: integer("amount").notNull(),
    status: text("status").$type<PaymentStatus>().notNull().default(PaymentStatus.PENDING),
    payment_method: text("payment_method").notNull(),
    payos_order_id: text("payos_order_id"),
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
    }),
    appointment: one(appointments, {
        fields: [payments.appointment_id],
        references: [appointments.id]
    })
}));

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;