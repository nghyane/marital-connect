import { api, APIError } from "encore.dev/api";
import { BlogCreateRequest, BlogCreateResponse } from "../interfaces/blog.interface";
import { blogService } from "../services/blog.service";
import { getAuthData } from "~encore/auth";
import { validateContent } from "../../../shared/utils";

export const blogCreate = api<BlogCreateRequest, BlogCreateResponse>(
    {
        expose: true,
        auth: true,
        method: "POST",
        path: "/blog/create",
    },
    async (params) => {
        const { title, content } = params;
        const userID = Number(getAuthData()!.userID);

        if (!validateContent(content)) {
            throw APIError.canceled("Invalid content");
        }

        const blog = await blogService.createBlogPost({ 
            author_id: userID,
            title,
            content,
            created_at: new Date(),
            updated_at: new Date(),
         });

        return { data: blog };
    }
)