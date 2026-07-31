import { dashboardRepository } from "../repositories/dashboard.repository";
import { progressService } from "@/modules/progress/services/progress.service";

class DashboardService {
  async getDashboardData(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayStats,
      upcomingAssessments,
      courseCardsRaw,
      weeklyActivity,
      streakData,
      overallStatsBase,
    ] = await Promise.all([
      dashboardRepository.getTodayStats(userId, today, tomorrow),
      dashboardRepository.getUpcomingAssessments(userId, today, 5),
      dashboardRepository.getCourseCards(userId),
      progressService.getWeeklyProgress(userId),
      progressService.getStudyStreak(userId),
      dashboardRepository.getOverallStats(userId),
    ]);

    const assessmentsMapped = upcomingAssessments.map((a) => {
      let diffDays = 0;
      let dateStr = null;

      if (a.date) {
        const d = new Date(a.date);
        dateStr = d.toISOString().split("T")[0];
        const diffTime = Math.abs(d.getTime() - today.getTime());
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      return {
        title: a.title,
        course: a.course,
        date: dateStr,
        daysRemaining: diffDays,
      };
    });

    let totalGlobalSessions = 0;
    let totalGlobalCompleted = 0;

    const courseCards = courseCardsRaw.map((c) => {
      totalGlobalSessions += c.totalSessions;
      totalGlobalCompleted += c.completedSessions;

      const completionPercentage =
        c.totalSessions > 0
          ? Math.round((c.completedSessions / c.totalSessions) * 100)
          : 0;

      const hoursRemaining = Math.max(
        0,
        Math.round(((c.totalMinutes || 0) - (c.completedMinutes || 0)) / 60)
      );

      return {
        id: c.id,
        name: c.name,
        completionPercentage,
        completedSessions: c.completedSessions,
        remainingSessions: c.remainingSessions,
        hoursRemaining,
      };
    });

    const overallCompletionPercentage =
      totalGlobalSessions > 0
        ? Math.round((totalGlobalCompleted / totalGlobalSessions) * 100)
        : 0;

    const overall = {
      ...overallStatsBase,
      studyStreak: streakData.currentStreak,
      completionPercentage: overallCompletionPercentage,
    };

    return {
      today: todayStats,
      assessments: assessmentsMapped,
      courses: courseCards,
      weeklyActivity,
      overall,
    };
  }
}

export const dashboardService = new DashboardService();
