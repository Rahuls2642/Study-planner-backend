import { ApiError } from "@/config/utils/ApiError";
import { courseRepository } from "@/modules/courses/repositories/course.repository";
import { topicRepository } from "@/modules/topics/repositories/topic.repository";
import { studyPreferenceRepository } from "@/modules/study-preferences/repositories/studyPreference.repository";
import { studyPlanRepository } from "@/modules/study-plans/repositories/study-plan.repository";
import { db } from "@/db";
import { generateStudySessions } from "../utils/generateStudySessions";
import { assignTopicsToSessions } from "../utils/assignTopicsToSessions";

class GenerateStudyPlanService {
  async execute(courseId: string, userId: string) {
    const course = await courseRepository.findById(
      courseId,
      userId
    );

    if (!course) {
      throw new ApiError(404, "Course not found.");
    }

    const preference =
      await studyPreferenceRepository.findByCourseId(
        courseId
      );

    if (!preference) {
      throw new ApiError(
        400,
        "Study preferences not found."
      );
    }

    const topics =
      await topicRepository.findByCourseId(courseId);

    if (!topics.length) {
      throw new ApiError(
        400,
        "No topics available."
      );
    }

    const sessions = generateStudySessions(
      {
        hoursPerDay: preference.hoursPerDay,
        sessionMinutes: preference.sessionMinutes,
        breakMinutes: preference.breakMinutes,
        studyDays: preference.studyDays,
        startDate: new Date(preference.startDate),
      },
      topics.length
    );

    const scheduledTopics = assignTopicsToSessions(topics, sessions);

    return db.transaction(async (tx) => {
      await studyPlanRepository.deleteByCourseId(
        courseId,
        tx
      );

      const rows = scheduledTopics.map(item => ({
        courseId,
        topicId: item.topicId,
        studyDate: new Date(item.date),
        sessionNumber: item.sessionNumber,
        estimatedMinutes: item.durationMinutes,
        status: "PENDING" as const,
      }));

      await studyPlanRepository.createMany(
        rows,
        tx
      );

      return rows;
    });
  }
}

export const generateStudyPlanService =
  new GenerateStudyPlanService();
