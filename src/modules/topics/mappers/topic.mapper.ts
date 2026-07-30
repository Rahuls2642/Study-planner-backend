import { topics } from "@/db/schema";

export const toTopicResponse = (topic: typeof topics.$inferSelect) => ({
  id: topic.id,
  courseId: topic.courseId,
  title: topic.title,
  order: topic.order,
  completed: topic.completed,
  createdAt: topic.createdAt,
});
