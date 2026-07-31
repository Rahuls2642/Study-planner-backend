import { Request, Response } from "express";
import { sendResponse } from "@/config/utils/apiResponse";
import { asyncHandler } from "@/config/utils/asyncHandler";
import { ApiError } from "@/config/utils/ApiError";
import { uploadSyllabusService } from "../services/uploadSyllabus.service";
import { confirmSyllabusService } from "../services/confirmSyllabus.service";

export const uploadSyllabus =
  asyncHandler(async (req: Request, res: Response) => {
    const data =
      await uploadSyllabusService.execute(
        req.params.courseId,
        req.user!.userId,
        req.file
      );

    sendResponse(
      res,
      200,
      "Syllabus analyzed successfully.",
      data
    );
  });

export const confirmSyllabus =
  asyncHandler(async (req: Request, res: Response) => {
    await confirmSyllabusService.execute(
      req.params.courseId,
      req.user!.userId,
      req.body
    );

    sendResponse(
      res,
      200,
      "Extraction confirmed successfully."
    );
  });
