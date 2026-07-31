import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { progressController } from "../controllers/progress.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Progress tracking and analytics
 */

/**
 * @swagger
 * /api/v1/progress/weekly:
 *   get:
 *     summary: Get weekly progress data
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly progress data retrieved successfully
 */
router.get("/weekly", authenticate, progressController.getWeeklyProgress);

/**
 * @swagger
 * /api/v1/progress/streak:
 *   get:
 *     summary: Get user study streak
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Study streak retrieved successfully
 */
router.get("/streak", authenticate, progressController.getStudyStreak);

export default router;
