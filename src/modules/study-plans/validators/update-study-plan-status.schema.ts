import { z } from "zod";

export const updateStudyPlanStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED"]),
  }),
});

export type UpdateStudyPlanStatusDto = z.infer<
  typeof updateStudyPlanStatusSchema
>["body"];
