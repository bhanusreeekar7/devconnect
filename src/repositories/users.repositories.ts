import { pool } from "../config/db.js";
import { User } from "../types/auth.types.js";

export class UserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query<User>("select * from users where email=$1", [email]);
        return result.rows[0] || null;
    }
    async findByUsername(username: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE username = $1;';
        const result = await pool.query<User>(query, [username]);
        return result.rows[0] || null;
    }
    async findById(id: string): Promise<User | null> {
        const query = 'SELECT * FROM users WHERE id = $1;';
        const result = await pool.query<User>(query, [id]);
        return result.rows[0] || null;
    }
    async create(username: string, email: string, passwordHash: string): Promise<User> {
        const insertUserQuery = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
        const userResult = await pool.query<User>(insertUserQuery, [username, email, passwordHash]);
        const newUser = userResult.rows[0]!;
        const insertProfileQuery = `
      INSERT INTO profiles (user_id)
      VALUES ($1);
    `;
        await pool.query(insertProfileQuery, [newUser.id]);
        return newUser;
    }
}

export const userRepository=new UserRepository();