import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { dashboardController } from "../controllers/dashboard.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: User dashboard aggregates
 */

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get all dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, dashboardController.getDashboard);

export default router;
