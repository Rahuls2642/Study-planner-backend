import { studyPlanRepository } from "../repositories/study-plan.repository";

class GetWeekStudyPlanService {
  async execute(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const plans = await studyPlanRepository.findWeek(
      userId,
      today,
      endOfWeek
    );

    const grouped: Record<string, any[]> = {};

    for (const plan of plans) {
      const dateStr = plan.studyDate.toISOString().split("T")[0];
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }

      grouped[dateStr].push({
        id: plan.id,
        topicTitle: plan.topic.title,
        courseName: plan.course.title,
        sessionNumber: plan.sessionNumber,
        duration: plan.estimatedMinutes,
        status: plan.status,
        part: plan.part,
        totalParts: plan.totalParts,
      });
    }

    const sortedDates = Object.keys(grouped).sort();

    return sortedDates.map((date) => ({
      date,
      sessions: grouped[date],
    }));
  }
}

export const getWeekStudyPlanService = new GetWeekStudyPlanService();
