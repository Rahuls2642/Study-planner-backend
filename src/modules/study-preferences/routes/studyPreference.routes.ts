import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { studyPreferenceController } from "../controllers/studyPreference.controller";
import { createStudyPreferenceSchema } from "../validations/studyPreference.schema";

const router = Router();

router.post(
  "/courses/:courseId/study-preferences",
  authenticate,
  validate(createStudyPreferenceSchema),
  studyPreferenceController.create
);

export default router;
