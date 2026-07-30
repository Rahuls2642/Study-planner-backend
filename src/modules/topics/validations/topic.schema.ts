import { z } from "zod";

export const updateTopicProgressSchema = z.object({
  params: z.object({
    topicId: z.string().uuid(),
  }),
  body: z.object({
    completed: z.boolean(),
  }),
});
