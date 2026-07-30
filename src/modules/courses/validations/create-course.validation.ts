import { z } from "zod";

export const createCourseSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(255),

    code: z.string().trim().max(100).optional(),

    instructor: z
      .string()
      .trim()
      .max(255)
      .optional(),

    description: z.string().trim().optional(),

    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
  }),
});

export type CreateCourseInput =
  z.infer<typeof createCourseSchema>["body"];
