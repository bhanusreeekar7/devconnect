export interface Like {
    id: string;
    post_id: string;
    user_id: string;
    created_at: Date;
}

export interface LikeToggleResult {
    liked: boolean;
    likes_count: number;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: Date;
    updated_at: Date;
}

export interface CommentWithAuthor extends Comment {
    username: string;
    avatar_url: string | null;
}

export interface CreateCommentDTO {
    content: string;
}
export interface FollowToggleResult {
    following: boolean;
}
