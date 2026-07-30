import { courseRepository } from "@/modules/courses/repositories/course.repository";
import { topicRepository } from "@/modules/topics/repositories/topic.repository";
import { assessmentRepository } from "@/modules/assessments/repositories/assessment.repository";
import { studyPlanRepository, TodayStudyPlan } from "@/modules/study-plans/repositories/study-plan.repository";
import { addDays, startOfDay } from "date-fns";

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

  async getToday(userId: string) {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const nextWeek = addDays(today, 7);
  
    const [todayPlans, upcomingAssessments] = await Promise.all([
      studyPlanRepository.findTodayByUser(
        userId,
        today,
        tomorrow
      ),
      assessmentRepository.findUpcomingByUser(
        userId,
        nextWeek
      ),
    ]);
  
    const tasks: TodayStudyPlan[] = todayPlans.map((plan: any) => ({
      id: plan.id,
      topicId: plan.topicId,
      topicTitle: plan.topic.title,
      courseId: plan.course.id,
      courseName: plan.course.name,
      estimatedMinutes: plan.estimatedMinutes,
      status: plan.status,
    }));
  
    const completedTasks = tasks.filter(
      (task) => task.status === "COMPLETED"
    ).length;
  
    const pendingTasks = tasks.filter(
      (task) => task.status === "PENDING"
    ).length;
  
    const skippedTasks = tasks.filter(
      (task) => task.status === "SKIPPED"
    ).length;
  
    const totalMinutes = tasks.reduce(
      (sum, task) => sum + task.estimatedMinutes,
      0
    );
  
    return {
      date: today,
  
      summary: {
        totalTasks: tasks.length,
        completedTasks,
        pendingTasks,
        skippedTasks,
        totalMinutes,
      },
  
      tasks,
  
      upcomingAssessments,
    };
  }
}

export const dashboardService =
  new DashboardService();
