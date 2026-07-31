import { Request, Response } from "express";
import { asyncHandler } from "@/config/utils/asyncHandler";
import { createStudyPreferenceService } from "../services/createStudyPreference.service";

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
}

export const studyPreferenceController =
  new StudyPreferenceController();
