import { pgTable, serial, text, timestamp, integer, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { experts } from "./experts.schema";
import { blogPosts } from "./blog-posts.schema";

export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
});

export const expertCategories = pgTable("expert_categories", {
  expert_id: integer("expert_id").references(() => experts.id).notNull(),
  category_id: integer("category_id").references(() => categories.id).notNull(),
}, (t) => [
  primaryKey({ columns: [t.expert_id, t.category_id] })
]);

export const blogCategories = pgTable("blog_categories", {
  blog_id: integer("blog_id").references(() => blogPosts.id).notNull(),
  category_id: integer("category_id").references(() => categories.id).notNull(),
}, (t) => [
  primaryKey({ columns: [t.blog_id, t.category_id] })
]);

export type Category = typeof categories.$inferSelect;

// relations
export const categoriesRelations = relations(categories, ({ many }) => ({
    expertsCategories: many(expertCategories),
    blogCategories: many(blogCategories),
}));


export const expertCategoriesRelations = relations(expertCategories, ({ one }) => ({
    expert: one(experts, {
        fields: [expertCategories.expert_id],
        references: [experts.id]
    }),
    category: one(categories, {
        fields: [expertCategories.category_id],
        references: [categories.id]
    }),
})); 

export const blogCategoriesRelations = relations(blogCategories, ({ one }) => ({
    blog: one(blogPosts, {
        fields: [blogCategories.blog_id],
        references: [blogPosts.id]
    }),
    category: one(categories, {
        fields: [blogCategories.category_id],
        references: [categories.id]
    }),
})); 