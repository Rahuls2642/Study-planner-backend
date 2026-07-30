import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./users";

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
