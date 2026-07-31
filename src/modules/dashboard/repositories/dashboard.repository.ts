import { sql, eq, and, gte, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { studyPlans, courses, assessments, topics } from "@/db/schema";

class DashboardRepository {
  async getTodayStats(userId: string, today: Date, tomorrow: Date) {
    const [result] = await db
      .select({
        totalSessions: sql<number>`count(*)`.mapWith(Number),
        completedSessions: sql<number>`count(case when ${studyPlans.status} = 'COMPLETED' then 1 end)`.mapWith(Number),
        remainingSessions: sql<number>`count(case when ${studyPlans.status} != 'COMPLETED' and ${studyPlans.status} != 'SKIPPED' then 1 end)`.mapWith(Number),
        minutesToday: sql<number>`sum(${studyPlans.estimatedMinutes})`.mapWith(Number),
      })
      .from(studyPlans)
      .where(
        and(
          inArray(
            studyPlans.courseId,
            db.select({ id: courses.id }).from(courses).where(eq(courses.userId, userId))
          ),
          gte(studyPlans.studyDate, today),
          sql`${studyPlans.studyDate} < ${tomorrow.toISOString()}`
        )
      );

    return {
      totalSessions: result?.totalSessions || 0,
      completedSessions: result?.completedSessions || 0,
      remainingSessions: result?.remainingSessions || 0,
      minutesToday: result?.minutesToday || 0,
    };
  }

  async getUpcomingAssessments(userId: string, today: Date, limit: number = 5) {
    return db
      .select({
        title: assessments.title,
        course: courses.title,
        date: assessments.examDate,
      })
      .from(assessments)
      .innerJoin(courses, eq(assessments.courseId, courses.id))
      .where(
        and(
          eq(courses.userId, userId),
          gte(assessments.examDate, today.toISOString().split("T")[0])
        )
      )
      .orderBy(assessments.examDate)
      .limit(limit);
  }

  async getCourseCards(userId: string) {
    return db
      .select({
        id: courses.id,
        name: courses.title,
        totalSessions: sql<number>`count(${studyPlans.id})`.mapWith(Number),
        completedSessions: sql<number>`count(case when ${studyPlans.status} = 'COMPLETED' then 1 end)`.mapWith(Number),
        remainingSessions: sql<number>`count(case when ${studyPlans.status} != 'COMPLETED' and ${studyPlans.status} != 'SKIPPED' then 1 end)`.mapWith(Number),
        totalMinutes: sql<number>`sum(${studyPlans.estimatedMinutes})`.mapWith(Number),
        completedMinutes: sql<number>`sum(case when ${studyPlans.status} = 'COMPLETED' then ${studyPlans.estimatedMinutes} else 0 end)`.mapWith(Number),
      })
      .from(courses)
      .leftJoin(studyPlans, eq(courses.id, studyPlans.courseId))
      .where(eq(courses.userId, userId))
      .groupBy(courses.id);
  }

  async getOverallStats(userId: string) {
    const [[coursesResult], [topicsResult], [completedTopicsResult], [assessmentsResult]] = await Promise.all([
      db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(courses).where(eq(courses.userId, userId)),
      db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(topics).innerJoin(courses, eq(topics.courseId, courses.id)).where(eq(courses.userId, userId)),
      db.select({ count: sql<number>`count(distinct ${studyPlans.topicId})`.mapWith(Number) }).from(studyPlans).where(
        and(
          inArray(studyPlans.courseId, db.select({ id: courses.id }).from(courses).where(eq(courses.userId, userId))),
          eq(studyPlans.status, 'COMPLETED')
        )
      ),
      db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(assessments).innerJoin(courses, eq(assessments.courseId, courses.id)).where(eq(courses.userId, userId))
    ]);

    return {
      courses: coursesResult?.count || 0,
      topics: topicsResult?.count || 0,
      completedTopics: completedTopicsResult?.count || 0,
      assessments: assessmentsResult?.count || 0,
    };
  }
}

export const dashboardRepository = new DashboardRepository();
