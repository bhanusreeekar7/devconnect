
export interface Profile {
    id: string;
    user_id: string;
    headline: string | null;
    bio: string | null;
    avatar_url: string | null;
    github_url: string | null;
    skills: string[];
    created_at: Date;
    updated_at: Date;
}

export interface ProfileWithUser extends Profile {
    username: string;
}

export interface UpdateProfileDTO {
    headline?: string;
    bio?: string;
    avatar_url?: string;
    github_url?: string;
    skills?: string[];
}
