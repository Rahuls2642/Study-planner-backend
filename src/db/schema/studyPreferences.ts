import {
  pgTable,
  uuid,
  integer,
  timestamp,
  date,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { courses } from "./courses";

export const studyPreferences = pgTable("study_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),

  courseId: uuid("course_id")
    .notNull()
    .unique()
    .references(() => courses.id, {
      onDelete: "cascade",
    }),

  hoursPerDay: integer("hours_per_day").notNull(),

  sessionMinutes: integer("session_minutes").notNull(),

  breakMinutes: integer("break_minutes").notNull(),

  studyDays: jsonb("study_days")
    .$type<number[]>()
    .notNull(),

  startDate: date("start_date").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const studyPreferenceRelations =
  relations(studyPreferences, ({ one }) => ({
    course: one(courses, {
      fields: [studyPreferences.courseId],
      references: [courses.id],
    }),
  }));
