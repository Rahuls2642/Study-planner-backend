import { Router } from "express";

import { authRoutes } from "@/modules/auth";
import { courseRoutes } from "@/modules/courses";

const router = Router();

router.get("/health", (_, res) => {
    res.json({
        success: true,
        message: "API Healthy",
    });
});

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);

export default router;