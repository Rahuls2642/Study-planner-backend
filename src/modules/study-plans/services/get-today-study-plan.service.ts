import { studyPlanRepository } from "../repositories/study-plan.repository";

class GetTodayStudyPlanService {
  async execute(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const plans = await studyPlanRepository.findTodayByUser(
      userId,
      today,
      tomorrow
    );

    return plans.map((plan) => ({
      id: plan.id,
      topicTitle: plan.topic.title,
      courseName: plan.course.title,
      duration: plan.estimatedMinutes,
      status: plan.status,
      part: plan.part,
      totalParts: plan.totalParts,
    }));
  }
}

export const getTodayStudyPlanService = new GetTodayStudyPlanService();
