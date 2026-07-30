import { db } from "@/db";
import { assessments } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

export class AssessmentRepository {
  async createMany(data: InferInsertModel<typeof assessments>[]) {
    if (data.length === 0) return [];
    return db.insert(assessments).values(data).returning();
  }
}

export const assessmentRepository = new AssessmentRepository();
