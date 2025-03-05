import { integer, pgTable, serial, text, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.schema";

export const userProfiles = pgTable("user_profiles", {
    id: serial("id").primaryKey(),
    user_id: integer("user_id").references(() => users.id).notNull().unique(),
    bio: text("bio"),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    country: text("country"),
    postal_code: varchar("postal_code", { length: 20 }),
    profile_image: text("profile_image"),
    preferences: jsonb("preferences").$type<Record<string, any>>().default({}),
    social_links: jsonb("social_links").$type<Record<string, string>>().default({}),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
    user: one(users, {
        fields: [userProfiles.user_id],
        references: [users.id]
    })
})); 