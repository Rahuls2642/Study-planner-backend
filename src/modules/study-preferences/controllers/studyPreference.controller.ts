import { Request, Response } from "express";
import { asyncHandler } from "@/config/utils/asyncHandler";
import { createStudyPreferenceService } from "../services/createStudyPreference.service";
import { getStudyPreferenceService } from "../services/getStudyPreference.service";

class StudyPreferenceController {
  create = asyncHandler(
    async (req: Request, res: Response) => {
      const preference =
        await createStudyPreferenceService.execute(
          req.params.courseId,
          req.user!.userId,
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          "Study preferences saved successfully.",
        data: preference,
      });
    }
  );

  get = asyncHandler(
    async (req: Request, res: Response) => {
      const preference = await getStudyPreferenceService.execute(
        req.params.courseId,
        req.user!.userId
      );

      res.status(200).json({
        success: true,
        data: preference,
      });
    }
  );
}

export const studyPreferenceController =
  new StudyPreferenceController();
