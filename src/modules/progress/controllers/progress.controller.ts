import { Request, Response } from "express";
import { asyncHandler } from "@/config/utils/asyncHandler";
import { progressService } from "../services/progress.service";

class ProgressController {
  getCourseProgress = asyncHandler(async (req: Request, res: Response) => {
    const data = await progressService.getCourseProgress(
      req.user.userId,
      req.params.courseId
    );

    res.json({
      success: true,
      data,
    });
  });

  getWeeklyProgress = asyncHandler(async (req: Request, res: Response) => {
    const data = await progressService.getWeeklyProgress(req.user.userId);

    res.json({
      success: true,
      data,
    });
  });

  getStudyStreak = asyncHandler(async (req: Request, res: Response) => {
    const data = await progressService.getStudyStreak(req.user.userId);

    res.json({
      success: true,
      data,
    });
  });
}

export const progressController = new ProgressController();
