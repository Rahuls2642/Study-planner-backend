import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { upload } from "@/config/multer";
import { uploadSyllabus, confirmSyllabus } from "../controllers/syllabus.controller";
import { confirmSyllabusSchema } from "../validations/confirmSyllabus.schema";

/**
 * @swagger
 * tags:
 *   name: Syllabus
 *   description: Syllabus uploads
 */

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * @swagger
 * /api/v1/courses/{courseId}/syllabus:
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
  "/",
  upload.single("file"),
  uploadSyllabus
);

/**
 * @swagger
 * /api/v1/courses/{courseId}/syllabus/confirm:
 *   post:
 *     summary: Confirm AI extraction
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rawText:
 *                 type: string
 *               topics:
 *                 type: array
 *                 items:
 *                   type: object
 *               assessments:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Extraction confirmed
 */
router.post(
  "/confirm",
  validate(confirmSyllabusSchema),
  confirmSyllabus
);

export default router;
