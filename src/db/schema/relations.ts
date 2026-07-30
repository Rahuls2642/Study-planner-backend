import { relations } from "drizzle-orm";

import { users } from "./users";
import { sessions } from "./sessions";
import { courses } from "./courses";

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
    ({ one }) => ({
        user: one(users, {
            fields: [courses.userId],
            references: [users.id],
        }),
    })
);
