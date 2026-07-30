import { Request, Response } from "express";
import { asyncHandler } from "@/config/utils/asyncHandler";
import { sendResponse } from "@/config/utils/apiResponse";
import { ApiError } from "@/config/utils/ApiError";
import { validateFileBuffer } from "@/config/utils/fileValidation";
import { analyzeSyllabusService } from "../services/analyzeSyllabus.service";

export const uploadSyllabus =
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(
        400,
        "File is required"
      );
    }

    validateFileBuffer(req.file);

    const data =
      await analyzeSyllabusService.execute(
        req.params.courseId,
        req.user!.userId,
        req.file
      );

    sendResponse(
      res,
      200,
      "Syllabus analyzed successfully",
      data
    );
  });
