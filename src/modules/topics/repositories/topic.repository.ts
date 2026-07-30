import { db } from "@/db";
import { topics } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

export class TopicRepository {
  async createMany(data: InferInsertModel<typeof topics>[]) {
    if (data.length === 0) return [];
    return db.insert(topics).values(data).returning();
  }
}

export const topicRepository = new TopicRepository();
