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

    const newStatus = data.status;

    let updateData: any = { status: newStatus };

    if (newStatus === "IN_PROGRESS" && !plan.startedAt) {
      updateData.startedAt = new Date();
    } else if (newStatus === "COMPLETED") {
      if (!plan.startedAt) updateData.startedAt = new Date();
      updateData.completedAt = new Date();
    } else if (newStatus === "PENDING" || newStatus === "SKIPPED") {
      // Allow reverting
      updateData.startedAt = null;
      updateData.completedAt = null;
    }

    return studyPlanRepository.updateStatus(planId, updateData);
  }
}

export const updateStudyPlanStatusService = new UpdateStudyPlanStatusService();
