import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sessions } from "@/db/schema";

class SessionRepository {
  async create(data: typeof sessions.$inferInsert) {
    const [session] = await db
      .insert(sessions)
      .values(data)
      .returning();

    return session;
  }

  async findById(id: string) {
    return db.query.sessions.findFirst({
      where: eq(sessions.id, id),
    });
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string
  ) {
    await db
      .update(sessions)
      .set({
        refreshToken,
      })
      .where(eq(sessions.id, id));
  }

  async delete(id: string) {
    await db
      .delete(sessions)
      .where(eq(sessions.id, id));
  }
}

export const sessionRepository =
  new SessionRepository();