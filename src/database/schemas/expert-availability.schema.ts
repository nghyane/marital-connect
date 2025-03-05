import { integer, pgTable, serial, text, timestamp, time, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { experts } from "./experts.schema";

export const WeekDay = {
    MONDAY: 'monday',
    TUESDAY: 'tuesday',
    WEDNESDAY: 'wednesday',
    THURSDAY: 'thursday',
    FRIDAY: 'friday',
    SATURDAY: 'saturday',
    SUNDAY: 'sunday',
} as const;

export type WeekDay = typeof WeekDay[keyof typeof WeekDay];

export const expertAvailability = pgTable("expert_availability", {
    id: serial("id").primaryKey(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    day_of_week: text("day_of_week").$type<WeekDay>().notNull(),
    start_time: time("start_time").notNull(),
    end_time: time("end_time").notNull(),
    is_available: boolean("is_available").default(true).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export type ExpertAvailability = typeof expertAvailability.$inferSelect;
export type NewExpertAvailability = typeof expertAvailability.$inferInsert;

export const expertAvailabilityRelations = relations(expertAvailability, ({ one }) => ({
    expert: one(experts, {
        fields: [expertAvailability.expert_id],
        references: [experts.id]
    })
})); 