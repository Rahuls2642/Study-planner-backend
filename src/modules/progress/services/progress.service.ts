import { ApiError } from "@/config/utils/ApiError";
import { progressRepository } from "../repositories/progress.repository";
import { courseRepository } from "@/modules/courses/repositories/course.repository";

class ProgressService {
  async getCourseProgress(userId: string, courseId: string) {
    const course = await courseRepository.findById(courseId);
    
    if (!course || course.userId !== userId) {
      throw new ApiError(404, "Course not found.");
    }

    const progress = await progressRepository.getCourseProgress(courseId);

    const totalSessions = progress.totalSessions || 0;
    const completedSessions = progress.completedSessions || 0;
    const completionPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    
    const totalHours = Math.round((progress.totalMinutes || 0) / 60);
    const completedHours = Math.round((progress.completedMinutes || 0) / 60);
    const remainingHours = Math.max(0, totalHours - completedHours);

    return {
      totalSessions,
      completedSessions,
      pendingSessions: progress.pendingSessions || 0,
      skippedSessions: progress.skippedSessions || 0,
      completionPercentage,
      totalHours,
      completedHours,
      remainingHours,
    };
  }

  async getWeeklyProgress(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    const weeklyData = await progressRepository.getWeeklyProgress(userId, sevenDaysAgo);

    return weeklyData.map(d => ({
      date: d.date.toISOString().split("T")[0],
      completed: d.completed,
      minutes: d.minutes
    }));
  }

  async getStudyStreak(userId: string) {
    const dates = await progressRepository.getDistinctCompletedDates(userId);
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dates.length === 0) {
      return { currentStreak: 0 };
    }

    let dateSet = new Set(dates.map(d => d.date.getTime()));

    let checkDate = today;
    
    if (dateSet.has(checkDate.getTime())) {
      currentStreak++;
      checkDate = yesterday;
    } else if (dateSet.has(yesterday.getTime())) {
      checkDate = yesterday;
    } else {
      return { currentStreak: 0 };
    }

    while (dateSet.has(checkDate.getTime())) {
      if (checkDate.getTime() !== today.getTime() && checkDate.getTime() !== yesterday.getTime() || (checkDate.getTime() === yesterday.getTime() && currentStreak > 0)) {
         currentStreak++;
      } else if (checkDate.getTime() === yesterday.getTime() && currentStreak === 0) {
         currentStreak++;
      }
      checkDate = new Date(checkDate);
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { currentStreak };
  }
}

export const progressService = new ProgressService();
