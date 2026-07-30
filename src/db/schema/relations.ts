import { relations } from "drizzle-orm";

import { users } from "./users";
import { sessions } from "./sessions";
import { courses } from "./courses";
import { syllabi } from "./syllabi";
import { topics } from "./topics";
import { assessments } from "./assessments";

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    courses: many(courses),
}));

export const sessionsRelations = relations(
    sessions,
    ({ one }) => ({
        user: one(users, {
            fields: [sessions.userId],
            references: [users.id],
        }),
    })
);

export const coursesRelations = relations(
    courses,
    ({ one, many }) => ({
        user: one(users, {
            fields: [courses.userId],
            references: [users.id],
        }),
        syllabi: many(syllabi),
        topics: many(topics),
        assessments: many(assessments),
    })
);

export const syllabiRelations = relations(
  syllabi,
  ({ one }) => ({
    course: one(courses, {
      fields: [syllabi.courseId],
      references: [courses.id],
    }),
  })
);

export const topicsRelations = relations(
  topics,
  ({ one }) => ({
    course: one(courses, {
      fields: [topics.courseId],
      references: [courses.id],
    }),
  })
);

export const assessmentsRelations =
  relations(assessments, ({ one }) => ({
    course: one(courses, {
      fields: [assessments.courseId],
      references: [courses.id],
    }),
  }));
