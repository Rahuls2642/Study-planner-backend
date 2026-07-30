import { Request, Response } from "express";

import { asyncHandler } from "@/config/utils/asyncHandler";
import { sendResponse } from "@/config/utils/apiResponse";

import { courseService } from "../services/course.service";

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await courseService.create(
      req.user!.userId,
      req.body
    );

    sendResponse(
      res,
      201,
      "Course created successfully",
      course
    );
  }
);

export const getCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await courseService.findAll(
      req.user!.userId,
      req.query as any
    );

    sendResponse(
      res,
      200,
      "Courses fetched successfully",
      result
    );
  }
);

export const getCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await courseService.findById(
      req.params.id,
      req.user!.userId
    );

    sendResponse(
      res,
      200,
      "Course fetched successfully",
      course
    );
  }
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const course = await courseService.update(
      req.params.id,
      req.user!.userId,
      req.body
    );

    sendResponse(
      res,
      200,
      "Course updated successfully",
      course
    );
  }
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    await courseService.delete(
      req.params.id,
      req.user!.userId
    );

    sendResponse(
      res,
      200,
      "Course deleted successfully"
    );
  }
);
