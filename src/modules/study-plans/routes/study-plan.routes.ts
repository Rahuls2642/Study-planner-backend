import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { generateStudyPlanSchema } from "../validators/generate-study-plan.schema";
import { studyPlanController } from "../controllers/study-plan.controller";

/**
 * @swagger
 * tags:
 *   name: Study Plans
 *   description: Study plan generation and management
 */

const router = Router({ mergeParams: true });

/**
 * @swagger
 * /api/v1/courses/{courseId}/study-plan:
 *   get:
 *     summary: Get the study plan for a course
 *     tags: [Study Plans]
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
 *         description: Study plan details
 */

router.get(
  "/",
  authenticate,
  studyPlanController.get
);

/**
 * @swagger
 * /api/v1/courses/{courseId}/study-plan/generate:
 *   post:
 *     summary: Generate a study plan using AI
 *     tags: [Study Plans]
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
 *               dailyStudyMinutes:
 *                 type: number
 *     responses:
 *       200:
 *         description: Study plan generated
 *       400:
 *         description: Bad request
 */
router.post(
  "/generate",
  authenticate,
  validate(generateStudyPlanSchema),
  studyPlanController.generate
);


export default router;
