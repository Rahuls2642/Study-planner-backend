import { studyPreferenceRepository } from "../repositories/studyPreference.repository";
import { ApiError } from "@/config/utils/ApiError";
import { courseRepository } from "@/modules/courses/repositories/course.repository";

class GetStudyPreferenceService {
  async execute(courseId: string, userId: string) {
    const course = await courseRepository.findById(courseId);
    
    if (!course || course.userId !== userId) {
      throw new ApiError(404, "Course not found");
    }

    const preference = await studyPreferenceRepository.findByCourseId(courseId);

    if (!preference) {
      throw new ApiError(404, "Study preferences not found for this course");
    }

    return preference;
  }
}

export const getStudyPreferenceService = new GetStudyPreferenceService();
