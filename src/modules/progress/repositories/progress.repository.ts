import { sql, eq, and, gte, desc, inArray } from "drizzle-orm";
import { db } from "@/db";
import { studyPlans, courses } from "@/db/schema";

class ProgressRepository {
  async getCourseProgress(courseId: string) {
    const [result] = await db
      .select({
        totalSessions: sql<number>`count(*)`.mapWith(Number),
        completedSessions: sql<number>`count(case when ${studyPlans.status} = 'COMPLETED' then 1 end)`.mapWith(Number),
        pendingSessions: sql<number>`count(case when ${studyPlans.status} = 'PENDING' then 1 end)`.mapWith(Number),
        skippedSessions: sql<number>`count(case when ${studyPlans.status} = 'SKIPPED' then 1 end)`.mapWith(Number),
        totalMinutes: sql<number>`sum(${studyPlans.estimatedMinutes})`.mapWith(Number),
        completedMinutes: sql<number>`sum(case when ${studyPlans.status} = 'COMPLETED' then ${studyPlans.estimatedMinutes} else 0 end)`.mapWith(Number),
      })
      .from(studyPlans)
      .where(eq(studyPlans.courseId, courseId));

    return result;
  }

  async getWeeklyProgress(userId: string, startDate: Date) {
    return db
      .select({
        date: studyPlans.studyDate,
        completed: sql<number>`count(*)`.mapWith(Number),
        minutes: sql<number>`sum(${studyPlans.estimatedMinutes})`.mapWith(Number),
      })
      .from(studyPlans)
      .where(
        and(
          inArray(
            studyPlans.courseId,
            db.select({ id: courses.id }).from(courses).where(eq(courses.userId, userId))
          ),
          eq(studyPlans.status, "COMPLETED"),
          gte(studyPlans.studyDate, startDate)
        )
      )
      .groupBy(studyPlans.studyDate)
      .orderBy(studyPlans.studyDate);
  }

  async getDistinctCompletedDates(userId: string) {
    return db
      .selectDistinct({ date: studyPlans.studyDate })
      .from(studyPlans)
      .where(
        and(
          inArray(
            studyPlans.courseId,
            db.select({ id: courses.id }).from(courses).where(eq(courses.userId, userId))
          ),
          eq(studyPlans.status, "COMPLETED")
        )
      )
      .orderBy(desc(studyPlans.studyDate));
  }
}

export const progressRepository = new ProgressRepository();
