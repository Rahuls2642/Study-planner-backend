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
        "IN_PROGRESS",
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

        part: integer("part").notNull().default(1),

        totalParts: integer("total_parts").notNull().default(1),

        status: studyPlanStatusEnum(
            "status"
        )
            .default("PENDING")
            .notNull(),

        startedAt: timestamp("started_at"),
        completedAt: timestamp("completed_at"),

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
