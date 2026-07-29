import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number(),

    NODE_ENV: z.enum(["development", "production"]),

    DATABASE_URL: z.string(),

    JWT_ACCESS_SECRET: z.string(),

    JWT_REFRESH_SECRET: z.string(),

    ACCESS_TOKEN_EXPIRES_IN: z.string(),

    REFRESH_TOKEN_EXPIRES_IN: z.string(),
});

export const env = envSchema.parse(process.env);