import {
  date,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { courses } from "./courses";

export const assessments = pgTable(
  "assessments",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    courseId: uuid("course_id")
      .references(() => courses.id, {
        onDelete: "cascade",
      })
      .notNull(),

    title: text("title").notNull(),

    examDate: date("exam_date"),

    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  }
);
