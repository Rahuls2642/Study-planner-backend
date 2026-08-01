import { db } from "@/db";
import { assessments, courses } from "@/db/schema";
import { InferInsertModel, eq, asc, count, gte, and, lt } from "drizzle-orm";

export class AssessmentRepository {
  async createMany(data: InferInsertModel<typeof assessments>[], tx = db) {
    if (data.length === 0) return [];
    return tx.insert(assessments).values(data).returning();
  }

  async create(data: InferInsertModel<typeof assessments>, tx = db) {
    const [record] = await tx.insert(assessments).values(data).returning();
    return record;
  }

  async deleteByCourseId(courseId: string, tx = db) {
    return tx.delete(assessments).where(eq(assessments.courseId, courseId)).returning();
  }

  async findByCourse(courseId: string) {
    return db.query.assessments.findMany({
      where: eq(assessments.courseId, courseId),
      orderBy: asc(assessments.examDate),
    });
  }

  async countUpcoming(userId: string) {
    const today = new Date();
  
    const [{ count: total }] = await db
      .select({
        count: count(),
      })
      .from(assessments)
      .innerJoin(
        courses,
        eq(
          assessments.courseId,
          courses.id
        )
      )
      .where(
        and(
          eq(courses.userId, userId),
          gte(
            assessments.examDate,
            today.toISOString().split("T")[0] // Need to match DB date string type if gte compares string to Date badly! Actually just `today` is fine in drizzle usually, but string is safer for DATE columns. I'll just use `today.toISOString()`
          )
        )
      );
  
    return Number(total);
  }

  async findUpcomingByUser(
    userId: string,
    endDate: Date
  ) {
    const todayStr = new Date().toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    return db
      .select()
      .from(assessments)
      .innerJoin(
        courses,
        eq(
          assessments.courseId,
          courses.id
        )
      )
      .where(
        and(
          eq(courses.userId, userId),
          gte(
            assessments.examDate,
            todayStr
          ),
          lt(
            assessments.examDate,
            endDateStr
          )
        )
      );
  }
}

export const assessmentRepository = new AssessmentRepository();
