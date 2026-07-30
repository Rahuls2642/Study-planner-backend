import {
    integer,
    pgEnum,
    pgTable,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import { courses } from "./courses";
import { topics } from "./topics";

export const studyPlanStatusEnum = pgEnum(
    "study_plan_status",
    [
        "PENDING",
        "COMPLETED",
        "SKIPPED",
    ]
);

export const studyPlans = pgTable(
    "study_plans",
    {
        id: uuid("id")
            .defaultRandom()
            .primaryKey(),

        courseId: uuid("course_id")
            .references(() => courses.id, {
                onDelete: "cascade",
            })
            .notNull(),

        topicId: uuid("topic_id")
            .references(() => topics.id, {
                onDelete: "cascade",
            })
            .notNull(),

        studyDate: timestamp("study_date", {
            mode: "date",
        }).notNull(),

        estimatedMinutes: integer(
            "estimated_minutes"
        ).notNull(),

        status: studyPlanStatusEnum(
            "status"
        )
            .default("PENDING")
            .notNull(),

        createdAt: timestamp(
            "created_at",
            {
                mode: "date",
            }
        )
            .defaultNow()
            .notNull(),

        updatedAt: timestamp(
            "updated_at",
            {
                mode: "date",
            }
        )
            .defaultNow()
            .notNull(),
    }
);
