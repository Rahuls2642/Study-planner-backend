import { ApiError } from "@/config/utils/ApiError";
import { courseRepository } from "@/modules/courses/repositories/course.repository";
import { studyPreferenceRepository } from "../repositories/studyPreference.repository";
import { CreateStudyPreferenceDto } from "../validations/studyPreference.schema";

class CreateStudyPreferenceService {
  async execute(
    courseId: string,
    userId: string,
    data: CreateStudyPreferenceDto
  ) {
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

    return studyPreferenceRepository.upsert({
      courseId,
      hoursPerDay: data.hoursPerDay,
      sessionMinutes: data.sessionMinutes,
      breakMinutes: data.breakMinutes,
      studyDays: data.studyDays,
      startDate: data.startDate,
    });
  }
}

export const createStudyPreferenceService =
  new CreateStudyPreferenceService();
