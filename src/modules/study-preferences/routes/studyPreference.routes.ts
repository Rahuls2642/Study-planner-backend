import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { studyPreferenceController } from "../controllers/studyPreference.controller";
import { createStudyPreferenceSchema } from "../validations/studyPreference.schema";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Study Preferences
 *   description: User preferences for study plans
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/study-preferences:
 *   post:
 *     summary: Create or update study preferences for a course
 *     tags: [Study Preferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
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
 *               hoursPerDay:
 *                 type: number
 *               sessionMinutes:
 *                 type: number
 *               breakMinutes:
 *                 type: number
 *               studyDays:
 *                 type: array
 *                 items:
 *                   type: number
 *               startDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Study preferences saved successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/courses/:courseId/study-preferences",
  authenticate,
  validate(createStudyPreferenceSchema),
  studyPreferenceController.create
);

/**
 * @swagger
 * /api/v1/courses/{courseId}/study-preferences:
 *   get:
 *     summary: Get study preferences for a course
 *     tags: [Study Preferences]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Study preferences retrieved successfully
 *       404:
 *         description: Preferences not found
 */
router.get(
  "/courses/:courseId/study-preferences",
  authenticate,
  studyPreferenceController.get
);

export default router;
