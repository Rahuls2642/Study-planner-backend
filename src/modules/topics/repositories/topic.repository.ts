import { db } from "@/db";
import { topics, courses } from "@/db/schema";
import { InferInsertModel, eq } from "drizzle-orm";

export class TopicRepository {
  async createMany(data: InferInsertModel<typeof topics>[]) {
    if (data.length === 0) return [];
    return db.insert(topics).values(data).returning();
  }

  async findByIdWithCourse(id: string) {
    const [topic] = await db.select().from(topics).where(eq(topics.id, id));
    if (!topic) return null;
    const [course] = await db.select().from(courses).where(eq(courses.id, topic.courseId));
    return { ...topic, course };
  }

  async updateProgress(id: string, completed: boolean) {
    const [topic] = await db
      .update(topics)
      .set({
        completed,
      })
      .where(eq(topics.id, id))
      .returning();

    return topic;
  }
}

export const topicRepository = new TopicRepository();
