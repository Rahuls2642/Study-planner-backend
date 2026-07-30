import { z } from "zod";

export const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),

  body: z
    .object({
      title: z.string().trim().min(1).max(255).optional(),

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
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message: "At least one field is required",
      }
    ),
});

export type UpdateCourseInput =
  z.infer<typeof updateCourseSchema>["body"];
