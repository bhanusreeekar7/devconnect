import { Pool } from "pg";
import { env } from "./env.js";

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
pool.on('connect', (client) => {
    client.query('SET search_path TO devconnect, public;');
    console.log('Connected to PostgreSQL database (schema: devconnect)');
});

pool.on('error', (err) => {
    console.error('Unexpected database error on idle client', err);
    process.exit(1);
});
