import 'dotenv/config';
import z from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CLIENT_URL: z.string().default('http://localhost:5173'),
    DATABASE_URL: z.string().min(1, "database url is required"),
    JWT_ACCESS_SECRET: z.string().min(10, 'JWT_ACCESS_SECRET must be at least 10 chars'),
    JWT_REFRESH_SECRET: z.string().min(10, 'JWT_REFRESH_SECRET must be at least 10 chars')
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("Invalid environment variables");
    process.exit(1);

}
export const env = parsed.data;
