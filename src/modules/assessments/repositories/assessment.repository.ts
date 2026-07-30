import { db } from "@/db";
import { assessments } from "@/db/schema";
import { InferInsertModel, eq, asc } from "drizzle-orm";

export class AssessmentRepository {
  async createMany(data: InferInsertModel<typeof assessments>[]) {
    if (data.length === 0) return [];
    return db.insert(assessments).values(data).returning();
  }

  async findByCourse(courseId: string) {
    return db.query.assessments.findMany({
      where: eq(assessments.courseId, courseId),
      orderBy: asc(assessments.examDate),
    });
  }
}

export const assessmentRepository = new AssessmentRepository();
