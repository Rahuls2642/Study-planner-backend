import { Router } from "express";

import { authenticate } from "@/middleware/auth.middleware";
import { dashboardController } from "../controllers/dashboard.controller";

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard overview and daily tasks
 */

const router = Router();

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get user dashboard overview
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview
 */
router.get(
  "/",
  authenticate,
  dashboardController.getOverview
);

/**
 * @swagger
 * /api/v1/dashboard/today:
 *   get:
 *     summary: Get today's study plan and tasks
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's tasks
 */
router.get(
  "/today",
  authenticate,
  dashboardController.today
);

export default router;
