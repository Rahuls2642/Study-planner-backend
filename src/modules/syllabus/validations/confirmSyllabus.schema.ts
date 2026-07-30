import { z } from "zod";

export const confirmSyllabusSchema = z.object({
  rawText: z.string().min(1),

  topics: z.array(
    z.object({
      title: z.string().min(1),
      difficulty: z.number().int().min(1).max(5),
      estimatedHours: z.number().positive(),
    })
  ),

  assessments: z.array(
    z.object({
      title: z.string().min(1),
      date: z.string(),
      weight: z.number().min(0).max(100),
    })
  ),
});

export type ConfirmSyllabusDto =
  z.infer<typeof confirmSyllabusSchema>;
