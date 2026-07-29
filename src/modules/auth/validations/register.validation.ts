import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(100),

        email: z
            .string()
            .trim()
            .email("Invalid email"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(100),
    })
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
