import { z } from "zod";

export const generateStudyPlanSchema = z.object({
  params: z.object({
    courseId: z.string().uuid(),
  })
});

export type GenerateStudyPlanDto = z.infer<
  typeof generateStudyPlanSchema
>;
