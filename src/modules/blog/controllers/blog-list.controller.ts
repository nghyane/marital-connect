import { api, APIError } from "encore.dev/api";
import { blogService } from "../services/blog.service";
import { BlogListRequest, BlogListResponse } from "../interfaces/blog.interface";


export const blogList = api<BlogListRequest, void>(
    {
        expose: true,
        auth: false,
        method: "GET",
        path: "/blog",
    },
    async (req) => {
        const { limit, offset } = req || { limit: 10, offset: 0 };

        const blogPosts = await blogService.getBlogPosts(limit, offset);

        
        console.log(blogPosts);
       
    }
);