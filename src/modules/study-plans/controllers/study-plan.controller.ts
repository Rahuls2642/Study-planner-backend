import { Request, Response } from "express";

import { asyncHandler } from "@/config/utils/asyncHandler";
import { studyPlanService } from "../services/study-plan.service";
import { getStudyPlanService } from "../services/get-study-plan.service";

export class StudyPlanController {
  generate = asyncHandler(
    async (req: Request, res: Response) => {
      const plans =
        await studyPlanService.generateStudyPlan(
          req.user.userId, // fixed this from req.user.id based on our previous bug fix
          req.params.courseId,
          req.body.dailyStudyMinutes
        );

      res.status(201).json({
        success: true,
        message:
          "Study plan generated successfully.",
        data: plans,
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
}

export const studyPlanController =
  new StudyPlanController();
