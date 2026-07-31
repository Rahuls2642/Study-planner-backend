import { Router } from "express";

import { authRoutes } from "@/modules/auth";
import { courseRoutes } from "@/modules/courses";
import { topicRoutes } from "@/modules/topics";
import dashboardRoutes from "@/modules/dashboard/routes/dashboard.routes";
import studyPreferenceRoutes from "@/modules/study-preferences/routes/studyPreference.routes";
import globalStudyPlanRoutes from "@/modules/study-plans/routes/global-study-plan.routes";
import progressRoutes from "@/modules/progress/routes/progress.routes";

const router = Router();

router.get("/health", (_, res) => {
    res.json({
        success: true,
        message: "API Healthy",
    });
});

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/topics", topicRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/study-plan", globalStudyPlanRoutes);
router.use("/progress", progressRoutes);
router.use(studyPreferenceRoutes);

export default router;