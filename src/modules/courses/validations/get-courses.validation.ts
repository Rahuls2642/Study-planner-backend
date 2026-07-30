import { z } from "zod";

export const getCoursesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  }),
});

export type GetCoursesQuery = z.infer<typeof getCoursesSchema>["query"];
