import { z } from "zod";

export const syllabusAiSchema = z.object({
  courseName: z.string(),

  topics: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      estimatedDurationMinutes: z.number().int().min(15).max(10000),
    })
  ),

  assessments: z.array(
    z.object({
      title: z.string(),
      date: z.string().nullable(),
    })
  ),
});

export type SyllabusAiResponse =
  z.infer<typeof syllabusAiSchema>;
