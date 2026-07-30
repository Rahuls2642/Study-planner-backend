import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number(),

    NODE_ENV: z.enum(["development", "production"]),

    DATABASE_URL: z.string(),

    JWT_ACCESS_SECRET: z.string(),

    JWT_REFRESH_SECRET: z.string(),

    ACCESS_TOKEN_EXPIRES_IN: z.enum([
        "15m",
        "30m",
        "1h",
        "2h",
        "7d",
    ]),

    REFRESH_TOKEN_EXPIRES_IN: z.enum([
        "7d",
        "30d",
    ]),

    AWS_ENDPOINT_URL_S3: z.string().url(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_REGION: z.string(),
    AWS_BUCKET: z.string(),

    GEMINI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);