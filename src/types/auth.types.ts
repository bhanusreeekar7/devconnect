export interface User {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export type SafeUser = Omit<User, "password_hash">;

export interface RegisterDTO {
    username: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;

}