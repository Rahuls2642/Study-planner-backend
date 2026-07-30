import { ApiError } from "@/config/utils/ApiError";

import { courseRepository } from "@/modules/courses/repositories/course.repository";
import { studyPlanRepository } from "../repositories/study-plan.repository";

class GetStudyPlanService {
  async execute(
    userId: string,
    courseId: string
  ) {
    const course =
      await courseRepository.findById(
        courseId,
        userId
      );

    if (!course) {
      throw new ApiError(
        404,
        "Course not found."
      );
    }

    return studyPlanRepository.findByCourse(
      courseId
    );
  }
}

export const getStudyPlanService =
  new GetStudyPlanService();
