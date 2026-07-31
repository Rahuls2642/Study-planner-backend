import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { studyPlanController } from "../controllers/study-plan.controller";
import { updateStudyPlanStatusSchema } from "../validators/update-study-plan-status.schema";

const router = Router();

/**
 * @swagger
 * /api/v1/study-plan/today:
 *   get:
 *     summary: Get today's study plan
 *     tags: [Study Plan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's study plan retrieved successfully
 */
router.get("/today", authenticate, studyPlanController.getToday);

/**
 * @swagger
 * /api/v1/study-plan/week:
 *   get:
 *     summary: Get this week's study plan
 *     tags: [Study Plan]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: This week's study plan retrieved successfully
 */
router.get("/week", authenticate, studyPlanController.getWeek);

/**
 * @swagger
 * /api/v1/study-plan/{planId}/status:
 *   patch:
 *     summary: Update study plan session status
 *     tags: [Study Plan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
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
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, SKIPPED]
 *     responses:
 *       200:
 *         description: Study plan status updated
 */
router.patch(
  "/:planId/status",
  authenticate,
  validate(updateStudyPlanStatusSchema),
  studyPlanController.updateStatus
);

export default router;
