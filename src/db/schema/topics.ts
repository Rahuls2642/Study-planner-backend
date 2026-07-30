import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { courses } from "./courses";

export const topics = pgTable("topics", {
  id: uuid("id").defaultRandom().primaryKey(),

  courseId: uuid("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),

  title: text("title").notNull(),

  order: integer("order").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});
