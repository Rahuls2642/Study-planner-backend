import { and, asc, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import { studyPlans } from "@/db/schema";

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
    status:
      | "PENDING"
      | "COMPLETED"
      | "SKIPPED"
  ) {
    const [plan] = await db
      .update(studyPlans)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(studyPlans.id, id))
      .returning();

    return plan;
  }

  async findById(id: string) {
    return db.query.studyPlans.findFirst({
      where: eq(studyPlans.id, id),
      with: {
        topic: true,
        course: true,
      },
    });
  }
}

export const studyPlanRepository =
  new StudyPlanRepository();
