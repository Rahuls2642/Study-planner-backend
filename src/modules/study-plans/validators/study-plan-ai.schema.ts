import { z } from "zod";

export const studyPlanAiSchema = z.object({
  days: z.array(
    z.object({
      date: z
        .string()
        .refine(
          (value) => !Number.isNaN(Date.parse(value)),
          {
            message: "Invalid date format",
          }
        ),

      tasks: z.array(
        z.object({
          // Keeping topicTitle as per your base schema, 
          topicIndex: z.number().int().positive(),

          estimatedMinutes: z
            .number()
            .int()
            .positive(),
        })
      ),
    })
  ),
});

export type StudyPlanAiResponse = z.infer<
  typeof studyPlanAiSchema
>;
