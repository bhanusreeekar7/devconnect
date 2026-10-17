import { pool } from "../config/db.js";
import { Profile, ProfileWithUser, UpdateProfileDTO } from "../types/profile.types.js";

export class ProfileRepository {
    async findByUsername(username: string): Promise<ProfileWithUser | null> {
        const query = `select p.id,p.user_id,p.headline,p.bio,p.avatar_url,p.github_url,p.skills,p.created_at,p.updated_at,u.username
        from profiles p
        inner join users u on p.user_id=u.id
        where u.username=$1`;
        const result = await pool.query<ProfileWithUser>(query, [username]);
        return result.rows[0] || null;
    }
    async findByUserId(userId: string): Promise<Profile | null> {
        const query = 'SELECT * FROM profiles WHERE user_id = $1;';
        const result = await pool.query<Profile>(query, [userId]);
        return result.rows[0] || null;
    }
    async update(userId: string, data: UpdateProfileDTO): Promise<Profile | null> {
        const fields: string[] = [];
        const params: any[] = [];
        if (data.headline !== undefined) {
            params.push(data.headline);
            fields.push(`headline = $${params.length}`);
        }
        if (data.bio !== undefined) {
            params.push(data.bio);
            fields.push(`bio = $${params.length}`);
        }
        if (data.avatar_url !== undefined) {
            params.push(data.avatar_url);
            fields.push(`avatar_url = $${params.length}`);
        }
        if (data.github_url !== undefined) {
            params.push(data.github_url);
            fields.push(`github_url = $${params.length}`);
        }
        if (data.skills !== undefined) {
            params.push(data.skills);
            fields.push(`skills = $${params.length}`);
        }
        // Always update updated_at timestamp
        fields.push(`updated_at = NOW()`);
        params.push(userId);
        const userIndex = params.length;
        const query = `
            UPDATE profiles
            SET ${fields.join(', ')}
            WHERE user_id = $${userIndex}
            RETURNING *;
        `;
        const result = await pool.query<Profile>(query, params);
        return result.rows[0] || null;
    }


}
export const profileRepository = new ProfileRepository();
