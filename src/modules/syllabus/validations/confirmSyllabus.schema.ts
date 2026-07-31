import { z } from "zod";

export const confirmSyllabusSchema = z.object({
  body: z.object({
    rawText: z.string().min(1),

    topics: z.array(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        estimatedDurationMinutes: z.number().int().min(15).max(10000),
      })
    ),

    assessments: z.array(
      z.object({
        title: z.string().min(1),
        date: z.string(),
        weight: z.number().min(0).max(100),
      })
    ),
  })
});

export type ConfirmSyllabusDto =
  z.infer<typeof confirmSyllabusSchema>["body"];
