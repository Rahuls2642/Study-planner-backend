import { z } from "zod";

export const syllabusAiSchema = z.object({
  courseName: z.string(),

  topics: z.array(
    z.object({
      title: z.string(),
      order: z.number(),
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
