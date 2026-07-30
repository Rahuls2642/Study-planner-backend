import { db } from "@/db";
import { studyPlans } from "@/db/schema";
import { ApiError } from "@/config/utils/ApiError";

import { courseRepository } from "@/modules/courses/repositories/course.repository";
import { topicRepository } from "@/modules/topics/repositories/topic.repository";
import { assessmentRepository } from "@/modules/assessments/repositories/assessment.repository";
import { studyPlanRepository } from "../repositories/study-plan.repository";

import { geminiService } from "@/services/ai/gemini.service";

class StudyPlanService {
  async generateStudyPlan(
    userId: string,
    courseId: string,
    dailyStudyMinutes: number
  ) {
    // 1. Verify course ownership
    const course = await courseRepository.findById(
      courseId,
      userId
    );

    if (!course) {
      throw new ApiError(
        404,
        "Course not found."
      );
    }

    // 2. Get incomplete topics
    const topics =
      await topicRepository.findIncompleteByCourse(
        courseId
      );

    if (topics.length === 0) {
      throw new ApiError(
        400,
        "All topics are already completed."
      );
    }

    // 3. Get assessments
    const assessments =
      await assessmentRepository.findByCourse(
        courseId
      );

    // 4. Generate AI study plan
    const aiPlan =
      await geminiService.generateStudyPlan(
        topics,
        assessments,
        dailyStudyMinutes
      );

    const topicMap = new Map(
        topics.map((topic, index) => [
            index + 1,
            topic,
        ])
    );

    const studyPlanData: typeof studyPlans.$inferInsert[] = [];

    for (const day of aiPlan.days) {
        for (const task of day.tasks) {
            const topic = topicMap.get(task.topicIndex);

            if (!topic) {
                throw new ApiError(
                    500,
                    `Invalid topic index returned by AI: ${task.topicIndex}`
                );
            }

            studyPlanData.push({
                courseId,
                topicId: topic.id,
                studyDate: new Date(day.date),
                estimatedMinutes: task.estimatedMinutes,
                status: "PENDING",
            });
        }
    }

    const createdPlans = await db.transaction(async (tx) => {
        await studyPlanRepository.deleteByCourse(
            courseId,
            tx
        );

        return studyPlanRepository.createMany(
            studyPlanData,
            tx
        );
    });

    return createdPlans;
  }
}

export const studyPlanService =
  new StudyPlanService();
