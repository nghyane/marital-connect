import { BlogPost } from "../../../database/schemas/blog-posts.schema";
import { DefaultResponse } from "../../../shared/types";


export interface BlogListRequest {
    limit?: number;
    offset?: number;
}

export interface BlogListResponse {
    data: BlogPost[];
    total: number;
    page: number;
    limit: number;
}

export interface BlogCreateRequest {
    title: string;
    content: string;
}

export interface BlogCreateResponse {
    data: BlogPost;
}

export interface BlogUpdateRequest {
    id: string;
    title: string;
    content: string;
}


export interface BlogUpdateResponse {
    data: BlogPost;
}

export interface BlogDeleteRequest {
    id: string;
}

export interface BlogDefaultResponse extends DefaultResponse {
}

export interface BlogPostInsert {
    title: string;
    content: string;
    author_id: number;
    created_at?: Date;
    updated_at?: Date;
}