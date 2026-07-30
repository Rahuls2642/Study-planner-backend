import { storageService } from "@/services/storage/storage.service";
import { courseService } from "@/modules/courses/services/course.service";
import { syllabusRepository } from "../repositories/syllabus.repository";
import { toSyllabusResponse } from "../mappers/syllabus.mapper";

class SyllabusService {
  async upload(
    courseId: string,
    userId: string,
    file: Express.Multer.File
  ) {
    await courseService.findOwnedCourse(
      courseId,
      userId
    );

    const uploaded =
      await storageService.upload(
        file,
        `courses/${courseId}/syllabus`
      );

    const syllabus =
      await syllabusRepository.create({
        courseId,

        fileName: file.originalname,

        storageKey: uploaded.storageKey,

        bucket: uploaded.bucket,

        mimeType: file.mimetype,
      });

    return toSyllabusResponse(
      syllabus
    );
  }
}

export const syllabusService =
  new SyllabusService();
