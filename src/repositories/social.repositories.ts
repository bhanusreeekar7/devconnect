import { pool } from '../config/db.js';
import { Like, Comment, CommentWithAuthor } from '../types/social.types.js';

export class SocialRepository {

    async findLike(postId: string, userId: string): Promise<Like | null> {
        const query = 'SELECT * FROM likes WHERE post_id = $1 AND user_id = $2;';
        const result = await pool.query<Like>(query, [postId, userId]);
        return result.rows[0] || null;
    }

    async addLike(postId: string, userId: string): Promise<void> {
        const query = `
            INSERT INTO likes (post_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT (post_id, user_id) DO NOTHING;
        `;
        await pool.query(query, [postId, userId]);
    }

    async removeLike(postId: string, userId: string): Promise<void> {
        const query = 'DELETE FROM likes WHERE post_id = $1 AND user_id = $2;';
        await pool.query(query, [postId, userId]);
    }

    async countLikes(postId: string): Promise<number> {
        const query = 'SELECT COUNT(*)::int as count FROM likes WHERE post_id = $1;';
        const result = await pool.query<{ count: number }>(query, [postId]);
        return result.rows[0]?.count || 0;
    }


    async createComment(postId: string, userId: string, content: string): Promise<Comment> {
        const query = `
            INSERT INTO comments (post_id, user_id, content)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query<Comment>(query, [postId, userId, content]);
        return result.rows[0]!;
    }

    async findCommentsByPostId(postId: string): Promise<CommentWithAuthor[]> {
        const query = `
            SELECT 
                c.id,
                c.post_id,
                c.user_id,
                c.content,
                c.created_at,
                c.updated_at,
                u.username,
                pr.avatar_url
            FROM comments c
            INNER JOIN users u ON c.user_id = u.id
            LEFT JOIN profiles pr ON c.user_id = pr.user_id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC;
        `;
        const result = await pool.query<CommentWithAuthor>(query, [postId]);
        return result.rows;
    }

    async findCommentById(commentId: string): Promise<Comment | null> {
        const query = 'SELECT * FROM comments WHERE id = $1;';
        const result = await pool.query<Comment>(query, [commentId]);
        return result.rows[0] || null;
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const query = 'DELETE FROM comments WHERE id = $1 RETURNING id;';
        const result = await pool.query(query, [commentId]);
        return (result.rowCount ?? 0) > 0;
    }
    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const query = 'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2;';
        const result = await pool.query(query, [followerId, followingId]);
        return (result.rowCount ?? 0) > 0;
    }

    async follow(followerId: string, followingId: string): Promise<void> {
        const query = `
            INSERT INTO follows (follower_id, following_id)
            VALUES ($1, $2)
            ON CONFLICT (follower_id, following_id) DO NOTHING;
        `;
        await pool.query(query, [followerId, followingId]);
    }

    async unfollow(followerId: string, followingId: string): Promise<void> {
        const query = 'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2;';
        await pool.query(query, [followerId, followingId]);
    }

}

export const socialRepository = new SocialRepository();
