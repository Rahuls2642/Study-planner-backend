import { Router } from "express";

import { authRoutes } from "@/modules/auth";

const router = Router();

router.get("/health", (_, res) => {
    res.json({
        success: true,
        message: "API Healthy",
    });
});

router.use("/auth", authRoutes);

export default router;