import { Router } from "express";

import { authenticate } from "@/middleware/auth.middleware";
import { dashboardController } from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  dashboardController.getOverview
);

router.get(
  "/today",
  authenticate,
  dashboardController.today
);

export default router;
