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
import studyPlanRoutes from "@/modules/study-plans/routes/study-plan.routes";

import { createCourseSchema } from "../validations/create-course.validation";
import { getCoursesSchema } from "../validations/get-courses.validation";
import { updateCourseSchema } from "../validations/update-course.validation";

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Bad request
 */
router.post(
  "/",
  validate(createCourseSchema),
  createCourse
);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses for the authenticated user
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get(
  "/",
  validate(getCoursesSchema),
  getCourses
);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Get a specific course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get("/:id", getCourse);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   patch:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated
 *       404:
 *         description: Course not found
 */
router.patch(
  "/:id",
  validate(updateCourseSchema),
  updateCourse
);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 *       404:
 *         description: Course not found
 */
router.delete(
  "/:id",
  deleteCourse
);

router.use(
  "/:courseId/study-plan",
  studyPlanRoutes
);

export default router;
