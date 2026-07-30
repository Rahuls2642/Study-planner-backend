import { db } from "@/db";
import { eq } from "drizzle-orm";
import { syllabi } from "@/db/schema";

class SyllabusRepository {
  async create(data: typeof syllabi.$inferInsert) {
    const [record] = await db
      .insert(syllabi)
      .values(data)
      .returning();

    return record;
  }

  async markProcessed(id: string) {
    await db
      .update(syllabi)
      .set({
        aiProcessed: true,
        updatedAt: new Date(),
      })
      .where(eq(syllabi.id, id));
  }
}

export const syllabusRepository =
  new SyllabusRepository();
