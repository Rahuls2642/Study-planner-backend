import { and, asc, eq, gte, lt, count, inArray } from "drizzle-orm";

import { db } from "@/db";
import { studyPlans, courses } from "@/db/schema";

export interface TodayStudyPlan {
  id: string;
  courseId: string;
  courseName: string;
  topicId: string;
  topicTitle: string;
  estimatedMinutes: number;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
}

class StudyPlanRepository {
  async create(
    data: typeof studyPlans.$inferInsert
  ) {
    const [plan] = await db
      .insert(studyPlans)
      .values(data)
      .returning();

    return plan;
  }

  async createMany(
    data: typeof studyPlans.$inferInsert[],
    tx: any = db
  ) {
    return tx
      .insert(studyPlans)
      .values(data)
      .returning();
  }

  async deleteByCourseId(
    courseId: string,
    tx: any = db
  ) {
    await tx
      .delete(studyPlans)
      .where(eq(studyPlans.courseId, courseId));
  }

  async findToday(
    courseId: string,
    today: Date
  ) {
    return db.query.studyPlans.findMany({
      where: and(
        eq(studyPlans.courseId, courseId),
        eq(studyPlans.studyDate, today)
      ),
      with: {
        topic: true,
      },
      orderBy: asc(studyPlans.studyDate),
    });
  }

  async findUpcoming(
    courseId: string,
    today: Date
  ) {
    return db.query.studyPlans.findMany({
      where: and(
        eq(studyPlans.courseId, courseId),
        gte(studyPlans.studyDate, today)
      ),
      with: {
        topic: true,
      },
      orderBy: asc(studyPlans.studyDate),
    });
  }

  async deleteByCourse(
    courseId: string,
    tx: any = db
  ) {
    await tx
      .delete(studyPlans)
      .where(
        eq(
          studyPlans.courseId,
          courseId
        )
      );
  }

  async findByCourse(courseId: string) {
    return db.query.studyPlans.findMany({
      where: eq(studyPlans.courseId, courseId),
      with: {
        topic: true,
      },
      orderBy: (studyPlan, { asc }) => [
        asc(studyPlan.studyDate),
      ],
    });
  }

  async updateStatus(
    id: string,
    updateData: Partial<typeof studyPlans.$inferInsert>
  ) {
    const [plan] = await db
      .update(studyPlans)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(studyPlans.id, id))
      .returning();

    return plan;
  }

  async getStatsByUser(userId: string) {
    const rows = await db
      .select({
        status: studyPlans.status,
        count: count(),
      })
      .from(studyPlans)
      .innerJoin(
        courses,
        eq(
          studyPlans.courseId,
          courses.id
        )
      )
      .where(eq(courses.userId, userId))
      .groupBy(studyPlans.status);
  
    const stats = {
      total: 0,
      completed: 0,
      pending: 0,
      skipped: 0,
    };
  
    for (const row of rows) {
      const value = Number(row.count);
  
      stats.total += value;
  
      if (row.status === "COMPLETED")
        stats.completed = value;
  
      if (row.status === "PENDING" || row.status === "IN_PROGRESS")
        stats.pending += value;
  
      if (row.status === "SKIPPED")
        stats.skipped = value;
    }
  
    return stats;
  }

  async findById(id: string, userId?: string) {
    return db.query.studyPlans.findFirst({
      where: (studyPlan, { eq, and }) => {
        if (!userId) return eq(studyPlan.id, id);
        return and(
          eq(studyPlan.id, id),
          inArray(
            studyPlan.courseId,
            db
              .select({ id: courses.id })
              .from(courses)
              .where(eq(courses.userId, userId))
          )
        );
      },
      with: {
        topic: true,
        course: true,
      },
    });
  }

  async findTodayByUser(
    userId: string,
    startOfDay: Date,
    endOfDay: Date
  ) {
    return db.query.studyPlans.findMany({
      where: (studyPlan, { and, gte, lt }) =>
        and(
          inArray(
            studyPlan.courseId,
            db
              .select({ id: courses.id })
              .from(courses)
              .where(eq(courses.userId, userId))
          ),
          gte(studyPlan.studyDate, startOfDay),
          lt(studyPlan.studyDate, endOfDay)
        ),
  
      with: {
        topic: true,
        course: true,
      },
  
      orderBy: (studyPlan, { asc }) => [
        asc(studyPlan.studyDate),
        asc(studyPlan.part),
      ],
    });
  }

  async findWeek(
    userId: string,
    startDate: Date,
    endDate: Date
  ) {
    return db.query.studyPlans.findMany({
      where: (studyPlan, { and, gte, lt }) =>
        and(
          inArray(
            studyPlan.courseId,
            db
              .select({ id: courses.id })
              .from(courses)
              .where(eq(courses.userId, userId))
          ),
          gte(studyPlan.studyDate, startDate),
          lt(studyPlan.studyDate, endDate)
        ),
  
      with: {
        topic: true,
        course: true,
      },
  
      orderBy: (studyPlan, { asc }) => [
        asc(studyPlan.studyDate),
        asc(studyPlan.part),
      ],
    });
  }
}

export const studyPlanRepository =
  new StudyPlanRepository();
