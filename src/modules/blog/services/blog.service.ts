import { db } from "../../../database/drizzle";
import { eq, sql } from "drizzle-orm";
import { BlogPost, blogPosts } from "../../../database/schemas/blog-posts.schema";
import { BlogPostInsert } from "../interfaces/blog.interface";

export const blogService = {
    getBlogPosts: async (limit: number = 10, offset: number = 0): Promise<{
        data: BlogPost[];
        count: number;
    }> => {
        const data = await db.select({
            record: blogPosts,
            count: sql<number>`count(*) over()`
        }).from(blogPosts).limit(limit).offset(offset);

        return {
            data: data.map((item) => item.record),
            count: data[0]?.count ?? 0
        };
    },  

    getBlogPost: async (id: number): Promise<BlogPost | null> => {
        const blogPost = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.id, id),
        });

        if (!blogPost) {
            return null;
        }

        return blogPost;
    },

    createBlogPost: async (blogPost: BlogPostInsert): Promise<BlogPost> => {
        const newBlogPost = await db.insert(blogPosts).values(blogPost).returning();

        return newBlogPost[0];
    },

    updateBlogPost: async (id: number, blogPost: BlogPost): Promise<BlogPost> => {
        const updatedBlogPost = await db.update(blogPosts).set(blogPost).where(eq(blogPosts.id, id)).returning();
        
        return updatedBlogPost[0];
    },

    deleteBlogPost: async (id: number): Promise<void> => {
        await db.delete(blogPosts).where(eq(blogPosts.id, id));
    },
}

export default blogService;