import { Router } from "express";
import { authenticate } from "@/middleware/auth.middleware";
import { progressController } from "../controllers/progress.controller";

const router = Router();

router.get("/weekly", authenticate, progressController.getWeeklyProgress);
router.get("/streak", authenticate, progressController.getStudyStreak);

export default router;
