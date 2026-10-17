export interface Post {
    id: string;
    user_id: string;
    title: string;
    content: string;
    code_snippet: string | null;
    code_language: string | null;
    tags: string[];
    created_at: Date;
    updated_at: Date;
}

export interface PostWithAuthor extends Post {
    username: string;
    avatar_url: string | null;
    headline: string | null;
    likes_count: number;
    comments_count: number;
}

export interface CreatePostDTO {
    title: string;
    content: string;
    code_snippet?: string;
    code_language?: string;
    tags?: string[];
}

export interface PostQueryParams {
    page?: number;
    limit?: number;
    tag?: string;
}
