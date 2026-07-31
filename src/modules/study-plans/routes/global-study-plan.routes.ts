import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { studyPlanController } from "../controllers/study-plan.controller";
import { updateStudyPlanStatusSchema } from "../validators/update-study-plan-status.schema";

const router = Router();

router.get("/today", authenticate, studyPlanController.getToday);

router.get("/week", authenticate, studyPlanController.getWeek);

router.patch(
  "/:planId/status",
  authenticate,
  validate(updateStudyPlanStatusSchema),
  studyPlanController.updateStatus
);

export default router;
