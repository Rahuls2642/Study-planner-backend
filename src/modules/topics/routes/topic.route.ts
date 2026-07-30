import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";
import { updateProgress } from "../controllers/topic.controller";
import { updateTopicProgressSchema } from "../validations/topic.schema";

const router = Router();

router.patch(
  "/:topicId/progress",
  authenticate,
  validate(updateTopicProgressSchema),
  updateProgress
);

export default router;
