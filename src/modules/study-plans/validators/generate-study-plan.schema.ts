import { z } from "zod";

export const generateStudyPlanSchema = z.object({
  body: z.object({
    dailyStudyMinutes: z
      .number()
      .int()
      .min(15)
      .max(720),
  }),
  params: z.object({
    courseId: z.string().uuid(),
  })
});

export type GenerateStudyPlanDto = z.infer<
  typeof generateStudyPlanSchema
>;
