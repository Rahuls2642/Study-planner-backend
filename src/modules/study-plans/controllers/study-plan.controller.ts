import { Request, Response } from "express";

import { asyncHandler } from "@/config/utils/asyncHandler";
import { generateStudyPlanService } from "../services/generateStudyPlan.service";
import { getStudyPlanService } from "../services/get-study-plan.service";
import { updateStudyPlanStatusService } from "../services/update-study-plan-status.service";
import { getTodayStudyPlanService } from "../services/get-today-study-plan.service";
import { getWeekStudyPlanService } from "../services/get-week-study-plan.service";

export class StudyPlanController {
  generate = asyncHandler(
    async (req: Request, res: Response) => {
      const plans =
        await generateStudyPlanService.execute(
          req.params.courseId,
          req.user.userId
        );

      res.status(201).json({
        success: true,
        message:
          "Study plan generated successfully.",
      });
    }
  );

  get = asyncHandler(
    async (req: Request, res: Response) => {
      const plans =
        await getStudyPlanService.execute(
          req.user.userId,
          req.params.courseId
        );

      res.json({
        success: true,
        data: plans,
      });
    }
  );

  getToday = asyncHandler(async (req: Request, res: Response) => {
    const plans = await getTodayStudyPlanService.execute(req.user.userId);
    res.json({
      success: true,
      data: plans,
    });
  });

  getWeek = asyncHandler(async (req: Request, res: Response) => {
    const plans = await getWeekStudyPlanService.execute(req.user.userId);
    res.json({
      success: true,
      data: plans,
    });
  });

  updateStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const result = await updateStudyPlanStatusService.execute(
        req.user.userId,
        req.params.planId,
        req.body
      );

      res.json({
        success: true,
        message: "Study session updated successfully.",
      });
    }
  );
}

export const studyPlanController =
  new StudyPlanController();
