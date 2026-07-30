import { Request, Response } from "express";
import { asyncHandler } from "@/config/utils/asyncHandler";
import { sendResponse } from "@/config/utils/apiResponse";
import { topicService } from "../services/topic.service";

export const updateProgress = asyncHandler(async (req: Request, res: Response) => {
  const { topicId } = req.params;
  const { completed } = req.body;
  const userId = req.user.userId; // Fix: The token payload contains userId, not id

  const topic = await topicService.updateProgress(topicId, userId, completed);

  sendResponse(
    res,
    200,
    "Topic updated successfully",
    topic
  );
});
