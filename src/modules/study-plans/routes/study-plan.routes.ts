import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { generateStudyPlanSchema } from "../validators/generate-study-plan.schema";
import { studyPlanController } from "../controllers/study-plan.controller";

const router = Router({ mergeParams: true });

router.get(
  "/",
  authenticate,
  studyPlanController.get
);

router.post(
  "/generate",
  authenticate,
  validate(generateStudyPlanSchema),
  studyPlanController.generate
);

export default router;
