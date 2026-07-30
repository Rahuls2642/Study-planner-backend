import { db } from "@/db";
import { syllabi } from "@/db/schema";

class SyllabusRepository {
  async create(data: typeof syllabi.$inferInsert) {
    const [record] = await db
      .insert(syllabi)
      .values(data)
      .returning();

    return record;
  }
}

export const syllabusRepository =
  new SyllabusRepository();
