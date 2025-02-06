import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const expertCertificates = pgTable("expert-certificates", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id).notNull(),
    certificate_id: text("certificate_id").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const expertCertificatesRelations = relations(expertCertificates, ({ one }) => ({
    user: one(users, {
        fields: [expertCertificates.user_id],
        references: [users.id]
    })
}));

export type ExpertCertificate = typeof expertCertificates.$inferSelect;