import { Request, Response } from "express";
import { asyncHandler } from "@/config/utils/asyncHandler";
import { sendResponse } from "@/config/utils/apiResponse";
import { ApiError } from "@/config/utils/ApiError";
import { syllabusService } from "../services/syllabus.service";
import { validateFileBuffer } from "@/config/utils/fileValidation";

export const uploadSyllabus =
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError(
        400,
        "File is required"
      );
    }

    validateFileBuffer(req.file);

    const syllabus =
      await syllabusService.upload(
        req.params.courseId,
        req.user!.userId,
        req.file
      );

    sendResponse(
      res,
      201,
      "Syllabus uploaded successfully",
      syllabus
    );
  });
