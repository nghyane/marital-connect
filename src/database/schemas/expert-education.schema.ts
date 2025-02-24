import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { experts } from "./experts.schema";
import { relations } from "drizzle-orm";

export const expertEducation = pgTable("expert_education", {
    id: serial("id").primaryKey(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    degree: text("degree").notNull(),
    institution: text("institution").notNull(),
    year: text("year").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
}); 

export type ExpertEducation = typeof expertEducation.$inferSelect;

export const expertEducationRelations = relations(expertEducation, ({ one }) => ({
    expert: one(experts, {
        fields: [expertEducation.expert_id],
        references: [experts.id],
    }),
}));