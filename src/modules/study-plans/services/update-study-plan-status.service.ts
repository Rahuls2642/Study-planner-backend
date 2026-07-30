import { ApiError } from "@/config/utils/ApiError";
import { studyPlanRepository } from "../repositories/study-plan.repository";

class UpdateStudyPlanStatusService {
  async execute(
    userId: string,
    planId: string,
    status: "PENDING" | "COMPLETED" | "SKIPPED"
  ) {
    const plan =
      await studyPlanRepository.findById(planId);

    if (!plan) {
      throw new ApiError(
        404,
        "Study plan not found."
      );
    }

    if (plan.course.userId !== userId) {
      throw new ApiError(
        403,
        "Forbidden"
      );
    }

    return studyPlanRepository.updateStatus(
      planId,
      status
    );
  }
}

export const updateStudyPlanStatusService =
  new UpdateStudyPlanStatusService();
