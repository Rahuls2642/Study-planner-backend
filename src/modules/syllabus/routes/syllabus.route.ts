import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { upload } from "@/config/multer";
import { uploadSyllabus } from "../controllers/syllabus.controller";

const router = Router();

router.use(authenticate);

router.post(
  "/:courseId",
  upload.single("file"),
  uploadSyllabus
);

export default router;
