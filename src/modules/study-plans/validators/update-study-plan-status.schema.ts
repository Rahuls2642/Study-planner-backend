import { z } from "zod";

export const updateStudyPlanStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "PENDING",
      "COMPLETED",
      "SKIPPED",
    ]),
  }),
  params: z.object({
    planId: z.string().uuid()
  })
});

export type UpdateStudyPlanStatusDto =
  z.infer<typeof updateStudyPlanStatusSchema>;
