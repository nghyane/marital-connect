import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const blogPosts = pgTable("blog-posts", {
    id: serial().primaryKey(),
    title: text().notNull(),
    content: text().notNull(),
    author_id: integer().references(() => users.id).notNull(),
    created_at: timestamp().defaultNow().notNull(),
    updated_at: timestamp().defaultNow().notNull()
});

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
    author: one(users, {
        fields: [blogPosts.author_id],
        references: [users.id]
    })
}));

export interface BlogPost {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at: Date;
    updated_at: Date;
}