import { pool } from '../config/db.js';
import { Post, PostWithAuthor, CreatePostDTO } from '../types/posts.types.js';

export class PostRepository {
    // 1. Create a new post
    async create(userId: string, data: CreatePostDTO): Promise<Post> {
        const query = `
            INSERT INTO posts (user_id, title, content, code_snippet, code_language, tags)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [
            userId,
            data.title,
            data.content,
            data.code_snippet || null,
            data.code_language || null,
            data.tags || [],
        ];
        const result = await pool.query<Post>(query, values);
        return result.rows[0]!;
    }

    // 2. Fetch the feed with author info, like count, comment count & pagination
    async findFeed(page: number = 1, limit: number = 10, tag?: string): Promise<PostWithAuthor[]> {
        const offset = (page - 1) * limit;
        const query = `
            SELECT 
                p.id,
                p.user_id,
                p.title,
                p.content,
                p.code_snippet,
                p.code_language,
                p.tags,
                p.created_at,
                p.updated_at,
                u.username,
                pr.avatar_url,
                pr.headline,
                COALESCE(COUNT(DISTINCT l.id), 0)::int AS likes_count,
                COALESCE(COUNT(DISTINCT c.id), 0)::int AS comments_count
            FROM posts p
            INNER JOIN users u ON p.user_id = u.id
            LEFT JOIN profiles pr ON p.user_id = pr.user_id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE ($1::text IS NULL OR $1 = ANY(p.tags))
            GROUP BY p.id, u.username, pr.avatar_url, pr.headline
            ORDER BY p.created_at DESC
            LIMIT $2 OFFSET $3;
        `;
        const result = await pool.query<PostWithAuthor>(query, [tag || null, limit, offset]);
        return result.rows;
    }

    async findById(id: string): Promise<PostWithAuthor | null> {
        const query = `
            SELECT 
                p.id,
                p.user_id,
                p.title,
                p.content,
                p.code_snippet,
                p.code_language,
                p.tags,
                p.created_at,
                p.updated_at,
                u.username,
                pr.avatar_url,
                pr.headline,
                COALESCE(COUNT(DISTINCT l.id), 0)::int AS likes_count,
                COALESCE(COUNT(DISTINCT c.id), 0)::int AS comments_count
            FROM posts p
            INNER JOIN users u ON p.user_id = u.id
            LEFT JOIN profiles pr ON p.user_id = pr.user_id
            LEFT JOIN likes l ON p.id = l.post_id
            LEFT JOIN comments c ON p.id = c.post_id
            WHERE p.id = $1
            GROUP BY p.id, u.username, pr.avatar_url, pr.headline;
        `;
        const result = await pool.query<PostWithAuthor>(query, [id]);
        return result.rows[0] || null;
    }

    async delete(id: string): Promise<boolean> {
        const query = 'DELETE FROM posts WHERE id = $1 RETURNING id;';
        const result = await pool.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

export const postRepository = new PostRepository();
