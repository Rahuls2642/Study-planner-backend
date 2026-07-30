import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

import { courses } from "./courses";

export const syllabi = pgTable("syllabi", {
  id: uuid("id").defaultRandom().primaryKey(),

  courseId: uuid("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),

  fileName: varchar("file_name", {
    length: 255,
  }).notNull(),

  storageKey: text("storage_key").notNull(),

  bucket: text("bucket").notNull(),

  mimeType: varchar("mime_type", {
    length: 100,
  }).notNull(),

  extractedText: text("extracted_text"),

  aiProcessed: boolean("ai_processed")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});
