import { and, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { courses } from "@/db/schema";

class CourseRepository {
  async create(data: typeof courses.$inferInsert) {
    const [course] = await db
      .insert(courses)
      .values(data)
      .returning();

    return course;
  }

  async findAllByUserId(userId: string, limit: number, offset: number) {
    const data = await db.query.courses.findMany({
      where: eq(courses.userId, userId),
      orderBy: desc(courses.createdAt),
      limit,
      offset,
    });

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(eq(courses.userId, userId));

    return { data, total: Number(count) };
  }

  async findById(id: string, userId: string) {
    return db.query.courses.findFirst({
      where: and(
        eq(courses.id, id),
        eq(courses.userId, userId)
      ),
    });
  }
}

export const courseRepository = new CourseRepository();
