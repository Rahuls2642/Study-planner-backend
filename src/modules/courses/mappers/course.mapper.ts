import { InferSelectModel } from "drizzle-orm";
import { courses } from "@/db/schema";

export type Course = InferSelectModel<typeof courses>;

export const toCourseResponse = (course: Course) => ({
  id: course.id,
  title: course.title,
  code: course.code,
  instructor: course.instructor,
  description: course.description,
  color: course.color,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
});
