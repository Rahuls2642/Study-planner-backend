import { ApiError } from "@/config/utils/ApiError";
import { studyPlanRepository } from "../repositories/study-plan.repository";
import { UpdateStudyPlanStatusDto } from "../validators/update-study-plan-status.schema";

class UpdateStudyPlanStatusService {
  async execute(
    userId: string,
    planId: string,
    data: UpdateStudyPlanStatusDto
  ) {
    const plan = await studyPlanRepository.findById(planId, userId);

    if (!plan) {
      throw new ApiError(404, "Study plan not found.");
    }

    const currentStatus = plan.status;
    const newStatus = data.status;

    let updateData: any = { status: newStatus };

    if (currentStatus === "PENDING") {
      if (newStatus === "IN_PROGRESS") {
        updateData.startedAt = new Date();
      } else if (newStatus !== "SKIPPED") {
        throw new ApiError(400, "Invalid status transition.");
      }
    } else if (currentStatus === "IN_PROGRESS") {
      if (newStatus === "COMPLETED") {
        updateData.completedAt = new Date();
      } else {
        throw new ApiError(400, "Invalid status transition.");
      }
    } else {
      throw new ApiError(400, "Invalid status transition.");
    }

    return studyPlanRepository.updateStatus(planId, updateData);
  }
}

export const updateStudyPlanStatusService = new UpdateStudyPlanStatusService();
