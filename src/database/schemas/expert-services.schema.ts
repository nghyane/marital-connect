import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { experts } from "./experts.schema";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

export const expertServices = pgTable("expert_services", {
    id: serial("id").primaryKey(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    name: text("name").notNull(),
    duration: text("duration").$type<'30min' | '45min' | '60min' | '90min'>().notNull(),
    price: integer("price").notNull(),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
}); 

export type ExpertService = typeof expertServices.$inferSelect;

export const expertServicesRelations = relations(expertServices, ({ one }) => ({
    expert: one(experts, {
        fields: [expertServices.expert_id],
        references: [experts.id],
    }),
}));