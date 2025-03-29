import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { experts } from "./experts.schema";
import { relations } from "drizzle-orm";


export const expertCertifications = pgTable("expert_certifications", {
    id: serial("id").primaryKey(),
    expert_id: integer("expert_id").references(() => experts.id).notNull(),
    name: text("name").notNull(),
    issuer: text("issuer").notNull(),
    year: text("year").notNull(),
    expiry_date: timestamp("expiry_date"),
    certificate_file_url: text("certificate_file_url"),
    verification_status: text("verification_status").default('pending').notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
}); 

export type ExpertCertification = typeof expertCertifications.$inferSelect;

export enum CertificationVerificationStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}

export const expertCertificationsRelations = relations(expertCertifications, ({ one }) => ({
    expert: one(experts, {
        fields: [expertCertifications.expert_id],
        references: [experts.id],
    }),
}));    
