import { app } from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

const server = app.listen(env.PORT, async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log("Database connection verified at:", res.rows[0].now);
    }
    catch (error) {
        console.error("Failed to connect to database on startup: ", error);
    }
});
async function gracefulShutdown(signal: string) {
    console.log(`Received shutdown ${signal} signal`);
    server.close(async () => {
        console.log("Server closed");
        try {
            await pool.end();
            console.log('🔌 Database pool connections drained.');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error during database pool shutdown:', err);
            process.exit(1);
        }

    });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
