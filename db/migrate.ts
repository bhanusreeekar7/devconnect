import fs from 'node:fs/promises';
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { pool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    console.log("Running database migrations");
    try {
        const schemaPath = path.join(__dirname, "schema.sql");
        const sql = await fs.readFile(schemaPath, 'utf-8');
        await pool.query(sql);
        console.log("All tables and indexes are successfully created");

    }
    catch (error) {
        console.error("migration failed", error);
    }
    finally {
        await pool.end();
    }
}
runMigration();