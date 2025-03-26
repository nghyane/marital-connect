import { integer, pgTable, serial, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { experts } from "./experts.schema";
import { users } from "./users.schema";
import { expertServices } from "./expert-services.schema";

export const AppointmentStatus = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELED: 'canceled',
    COMPLETED: 'completed',
    RESCHEDULED: 'rescheduled',
} as const;

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const appointments = pgTable("appointments", {
    id: serial("id").primaryKey(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    user_id: integer("user_id").references(() => users.id).notNull(),
    service_id: integer("service_id").references(() => expertServices.id).notNull(),
    scheduled_time: timestamp("scheduled_time").notNull(),
    end_time: timestamp("end_time").notNull(),
    status: text("status").$type<AppointmentStatus>().notNull().default(AppointmentStatus.PENDING),
    notes: text("notes"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export type Appointment = typeof appointments.$inferSelect;

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
    expert: one(experts, {
        fields: [appointments.expert_id],
        references: [experts.id]
    }),
    user: one(users, {
        fields: [appointments.user_id],
        references: [users.id]
    }),
    service: one(expertServices, {
        fields: [appointments.service_id],
        references: [expertServices.id]
    })
}));

