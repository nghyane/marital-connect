import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { appointments } from "./appointments.schema";
import { users } from "./users.schema";
import { experts } from "./experts.schema";

export const feedback = pgTable("feedback", {
    id: serial("id").primaryKey(),
    appointment_id: integer("appointment_id").references(() => appointments.id).notNull(),
    user_id: integer("user_id").references(() => users.id).notNull(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export type Feedback = typeof feedback.$inferSelect;

export const feedbackRelations = relations(feedback, ({ one }) => ({
    appointment: one(appointments, {
        fields: [feedback.appointment_id],
        references: [appointments.id]
    }),
    user: one(users, {
        fields: [feedback.user_id],
        references: [users.id]
    }),
    expert: one(experts, {
        fields: [feedback.expert_id],
        references: [experts.id]
    })
}));