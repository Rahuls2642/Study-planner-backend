import { Router } from "express";

import { authRoutes } from "@/modules/auth";
import { courseRoutes } from "@/modules/courses";
import { syllabusRoutes } from "@/modules/syllabus";
import { topicRoutes } from "@/modules/topics";

const router = Router();

router.get("/health", (_, res) => {
    res.json({
        success: true,
        message: "API Healthy",
    });
});

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/syllabus", syllabusRoutes);
router.use("/topics", topicRoutes);

export default router;