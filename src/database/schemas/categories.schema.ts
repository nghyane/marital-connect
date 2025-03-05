import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { experts } from "./experts.schema";

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

// Junction table for many-to-many relationship between experts and categories
export const expertCategories = pgTable("expert_categories", {
    expert_id: serial("expert_id").references(() => experts.id).notNull(),
    category_id: serial("category_id").references(() => categories.id).notNull()
}, (table) => {
    return {
        pk: { name: "expert_categories_pk", columns: [table.expert_id, table.category_id] }
    };
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export const categoriesRelations = relations(categories, ({ many }) => ({
    experts: many(expertCategories)
}));

export const expertCategoriesRelations = relations(expertCategories, ({ one }) => ({
    expert: one(experts, {
        fields: [expertCategories.expert_id],
        references: [experts.id]
    }),
    category: one(categories, {
        fields: [expertCategories.category_id],
        references: [categories.id]
    })
})); 