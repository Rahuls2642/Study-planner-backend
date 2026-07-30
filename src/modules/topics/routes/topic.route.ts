import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { updateProgress } from "../controllers/topic.controller";
import { updateTopicProgressSchema } from "../validations/topic.schema";

/**
 * @swagger
 * tags:
 *   name: Topics
 *   description: Topic management
 */

const router = Router();

/**
 * @swagger
 * /api/v1/topics/{topicId}/progress:
 *   patch:
 *     summary: Update topic progress
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
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
 *               progress:
 *                 type: number
 *     responses:
 *       200:
 *         description: Topic progress updated
 *       400:
 *         description: Bad request
 */
router.patch(
  "/:topicId/progress",
  authenticate,
  validate(updateTopicProgressSchema),
  updateProgress
);

export default router;
