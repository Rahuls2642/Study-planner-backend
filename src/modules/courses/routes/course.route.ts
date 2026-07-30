import { Router } from "express";

import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";

import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";

import { createCourseSchema } from "../validations/create-course.validation";
import { getCoursesSchema } from "../validations/get-courses.validation";
import { updateCourseSchema } from "../validations/update-course.validation";

const router = Router();

router.use(authenticate);

router.post(
  "/",
  validate(createCourseSchema),
  createCourse
);

router.get(
  "/",
  validate(getCoursesSchema),
  getCourses
);

router.get("/:id", getCourse);

router.patch(
  "/:id",
  validate(updateCourseSchema),
  updateCourse
);

router.delete(
  "/:id",
  deleteCourse
);

export default router;
