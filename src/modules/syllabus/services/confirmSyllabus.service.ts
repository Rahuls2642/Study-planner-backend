import { ConfirmSyllabusDto } from "../validations/confirmSyllabus.schema";
import { db } from "@/db";
import { syllabusRepository } from "../repositories/syllabus.repository";
import { topicRepository } from "@/modules/topics/repositories/topic.repository";
import { assessmentRepository } from "@/modules/assessments/repositories/assessment.repository";
import { courseRepository } from "@/modules/courses/repositories/course.repository";
import { ApiError } from "@/config/utils/ApiError";

class ConfirmSyllabusService {
  async execute(courseId: string, userId: string, data: ConfirmSyllabusDto) {
    const course = await courseRepository.findById(courseId, userId);
    if (!course) {
      throw new ApiError(404, "Course not found.");
    }

    await db.transaction(async (tx) => {
      const syllabus = await syllabusRepository.create(
        {
          courseId,
          fileName: "Confirmed Extraction",
          storageKey: "none",
          bucket: "none",
          mimeType: "text/plain",
          extractedText: data.rawText,
          aiProcessed: true,
        },
        tx
      );

      if (data.topics && data.topics.length > 0) {
        await topicRepository.createMany(
          data.topics.map((topic, index) => ({
            courseId,
            title: topic.title,
            description: topic.description,
            estimatedDurationMinutes: topic.estimatedDurationMinutes,
            order: index + 1,
            completed: false,
          })),
          tx
        );
      }

      if (data.assessments && data.assessments.length > 0) {
        await assessmentRepository.createMany(
          data.assessments.map((a) => ({
            courseId,
            title: a.title,
            examDate: a.date,
          })),
          tx
        );
      }
    });

    return null;
  }
}

export const confirmSyllabusService =
  new ConfirmSyllabusService();
