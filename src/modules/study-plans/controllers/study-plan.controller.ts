import { Request, Response } from "express";

import { asyncHandler } from "@/config/utils/asyncHandler";
import { generateStudyPlanService } from "../services/generateStudyPlan.service";
import { getStudyPlanService } from "../services/get-study-plan.service";
import { updateStudyPlanStatusService } from "../services/update-study-plan-status.service";

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

  updateStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const result =
        await updateStudyPlanStatusService.execute(
          req.user.userId,
          req.params.planId,
          req.body.status
        );

      res.json({
        success: true,
        message:
          "Study plan updated successfully.",
        data: result,
      });
    }
  );
}

export const studyPlanController =
  new StudyPlanController();
