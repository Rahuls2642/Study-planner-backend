import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "./users";
import { syllabi } from "./syllabi";
import { topics } from "./topics";
import { assessments } from "./assessments";
import { studyPlans } from "./study-plans";
import { studyPreferences } from "./studyPreferences";

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: varchar("title", { length: 255 }).notNull(),

  code: varchar("code", { length: 100 }),

  instructor: varchar("instructor", {
    length: 255,
  }),

  description: text("description"),

  color: varchar("color", {
    length: 20,
  }).default("#3B82F6"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export const courseRelations = relations(
  courses,
  ({ many, one }) => ({
    syllabus: one(syllabi, {
      fields: [courses.id],
      references: [syllabi.courseId],
    }),
    topics: many(topics),
    assessments: many(assessments),
    studyPlans: many(studyPlans),
    studyPreference: one(studyPreferences, {
      fields: [courses.id],
      references: [studyPreferences.courseId],
    }),
  })
);
