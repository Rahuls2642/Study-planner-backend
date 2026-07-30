import { courseRepository } from "@/modules/courses/repositories/course.repository";
import { topicRepository } from "@/modules/topics/repositories/topic.repository";
import { assessmentRepository } from "@/modules/assessments/repositories/assessment.repository";
import { studyPlanRepository } from "@/modules/study-plans/repositories/study-plan.repository";

class DashboardService {
  async getOverview(userId: string) {
    const [
      totalCourses,
      topicStats,
      studyPlanStats,
      upcomingAssessments,
    ] = await Promise.all([
      courseRepository.countByUser(userId),
      topicRepository.getStatsByUser(userId),
      studyPlanRepository.getStatsByUser(userId),
      assessmentRepository.countUpcoming(userId),
    ]);

    const completionPercentage =
      topicStats.total === 0
        ? 0
        : Number(
            (
              (topicStats.completed /
                topicStats.total) *
              100
            ).toFixed(2)
          );

    return {
      totalCourses,

      totalTopics: topicStats.total,

      completedTopics:
        topicStats.completed,

      completionPercentage,

      totalStudyPlans:
        studyPlanStats.total,

      completedStudyPlans:
        studyPlanStats.completed,

      pendingStudyPlans:
        studyPlanStats.pending,

      skippedStudyPlans:
        studyPlanStats.skipped,

      upcomingAssessments,
    };
  }
}

export const dashboardService =
  new DashboardService();
