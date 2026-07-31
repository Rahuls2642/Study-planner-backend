import { db } from "@/db";
import { studyPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";

class StudyPreferenceRepository {
  async upsert(
    data: typeof studyPreferences.$inferInsert
  ) {
    const [preference] = await db
      .insert(studyPreferences)
      .values(data)
      .onConflictDoUpdate({
        target: studyPreferences.courseId,
        set: {
          hoursPerDay: data.hoursPerDay,
          sessionMinutes: data.sessionMinutes,
          breakMinutes: data.breakMinutes,
          studyDays: data.studyDays,
          startDate: data.startDate,
          updatedAt: new Date(),
        },
      })
      .returning();

    return preference;
  }

  async findByCourseId(courseId: string) {
    const [preference] = await db
      .select()
      .from(studyPreferences)
      .where(eq(studyPreferences.courseId, courseId));

    return preference ?? null;
  }
}

export const studyPreferenceRepository =
  new StudyPreferenceRepository();
