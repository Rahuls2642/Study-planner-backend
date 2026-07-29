import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
    res.json({
        success: true,
        message: "API Healthy",
    });
});

export default router;