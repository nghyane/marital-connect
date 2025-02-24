import { integer, pgTable, serial, text, jsonb, real } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { relations } from "drizzle-orm";
import { expertEducation } from "./expert-education.schema";
import { expertCertifications } from "./expert-certifications.schema";
import { expertServices } from "./expert-services.schema";

export const ExpertAvailabilityStatus = {
    OFFLINE: 'offline',
    ONLINE: 'online',
    BUSY: 'busy',
    AWAY: 'away',
} as const;

export type ExpertAvailabilityStatus = typeof ExpertAvailabilityStatus[keyof typeof ExpertAvailabilityStatus];

export const experts = pgTable("experts", {
    id: serial().primaryKey(), 
    user_id: integer().references(() => users.id).notNull(),
    title: text().notNull(), 
    location: text().notNull(), 
    experience: real().notNull(), 
    specialties: jsonb().$type<readonly string[]>().notNull().default([]),
    availability_status: text().notNull().$type<ExpertAvailabilityStatus>().default(ExpertAvailabilityStatus.OFFLINE),
    about: text().notNull(),
});

export type Expert = typeof experts.$inferSelect;

export const expertsRelations = relations(experts, ({ one, many }) => ({
    user: one(users, {
        fields: [experts.user_id],
        references: [users.id],
    }),
    education: many(expertEducation),
    certifications: many(expertCertifications),
    services: many(expertServices),
}));

