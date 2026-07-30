import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { upload } from "@/config/multer";
import { uploadSyllabus } from "../controllers/syllabus.controller";

/**
 * @swagger
 * tags:
 *   name: Syllabus
 *   description: Syllabus uploads
 */

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/v1/syllabus/{courseId}:
 *   post:
 *     summary: Analyze a syllabus PDF without saving (Preview)
 *     tags: [Syllabus]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Syllabus analyzed and preview returned
 *       400:
 *         description: Bad request
 */
router.post(
  "/:courseId",
  upload.single("file"),
  uploadSyllabus
);

export default router;
