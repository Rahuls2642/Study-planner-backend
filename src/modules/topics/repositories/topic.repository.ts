import { db } from "@/db";
import { topics, courses } from "@/db/schema";
import { InferInsertModel, eq, count, and, sql } from "drizzle-orm";

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

  async findIncompleteByCourse(courseId: string) {
    return db.query.topics.findMany({
      where: (topic, { and, eq }) =>
        and(
          eq(topic.courseId, courseId),
          eq(topic.completed, false)
        ),
      orderBy: (topic, { asc }) => [
        asc(topic.order),
      ],
    });
  }

  async getStatsByUser(userId: string) {
    const result = await db
      .select({
        total: count(),
        completed: sql<number>`
          COUNT(*) FILTER (WHERE ${topics.completed}=true)
        `,
      })
      .from(topics)
      .innerJoin(
        courses,
        eq(topics.courseId, courses.id)
      )
      .where(eq(courses.userId, userId));
  
    return {
      total: Number(result[0].total),
      completed: Number(result[0].completed),
    };
  }
}

export const topicRepository = new TopicRepository();
