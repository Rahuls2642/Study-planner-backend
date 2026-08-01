import { z } from "zod";

export const createStudyPreferenceSchema = z.object({
  body: z.object({
    hoursPerDay: z.number().int().min(0).max(24),
    minutesPerDay: z.number().int().min(0).max(59).optional().default(0),

    sessionMinutes: z
      .number()
      .int()
      .min(15)
      .max(180),

    breakMinutes: z
      .number()
      .int()
      .min(0)
      .max(60),

    studyDays: z
      .array(z.number().int().min(0).max(6))
      .min(1),

    startDate: z.string(),
    examDate: z.string().optional(),
  })
});

export type CreateStudyPreferenceDto =
  z.infer<typeof createStudyPreferenceSchema>["body"];
