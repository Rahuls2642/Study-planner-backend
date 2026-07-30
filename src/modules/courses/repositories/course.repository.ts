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

    return {
      data,
      meta: {
        total: Number(count),
        page: Math.floor(offset / limit) + 1,
        limit,
      },
    };
  }

  async countByUser(userId: string) {
    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(courses)
      .where(eq(courses.userId, userId));
  
    return Number(count);
  }

  async findById(id: string, userId: string) {
    return db.query.courses.findFirst({
      where: and(
        eq(courses.id, id),
        eq(courses.userId, userId)
      ),
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<typeof courses.$inferInsert>
  ) {
    const [course] = await db
      .update(courses)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(courses.id, id),
          eq(courses.userId, userId)
        )
      )
      .returning();

    return course;
  }

  async delete(id: string, userId: string) {
    const [course] = await db
      .delete(courses)
      .where(
        and(
          eq(courses.id, id),
          eq(courses.userId, userId)
        )
      )
      .returning();

    return course;
  }
}

export const courseRepository = new CourseRepository();
