import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

import { courses } from "./courses";
import { assessments } from "./assessments";

export const topics = pgTable("topics", {
  id: uuid("id").defaultRandom().primaryKey(),

  courseId: uuid("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: text("title").notNull(),

  description: text("description"),

  order: integer("order").notNull(),

  estimatedDurationMinutes: integer("estimated_duration_minutes")
    .notNull()
    .default(60),

  assessmentId: uuid("assessment_id")
    .references(() => assessments.id, {
      onDelete: "set null",
    }),

  completed: boolean("completed")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});
