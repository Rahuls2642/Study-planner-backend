import { storageService } from "@/services/storage/storage.service";
import { courseService } from "@/modules/courses/services/course.service";
import { syllabusRepository } from "../repositories/syllabus.repository";
import { toSyllabusResponse } from "../mappers/syllabus.mapper";
import { pdfService } from "@/services/pdf/pdf.service";
import { geminiService } from "@/services/ai/gemini.service";
import { topicRepository } from "@/modules/topics/repositories/topic.repository";
import { assessmentRepository } from "@/modules/assessments/repositories/assessment.repository";
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

    let extractedText = null;
    if (file.mimetype === "application/pdf") {
      extractedText = await pdfService.extract(file.buffer);
    }

    const syllabus =
      await syllabusRepository.create({
        courseId,

        fileName: file.originalname,

        storageKey: uploaded.storageKey,

        bucket: uploaded.bucket,

        mimeType: file.mimetype,
        
        extractedText,
        
        aiProcessed: false,
      });

    if (extractedText) {
      const aiResult = await geminiService.analyzeSyllabus(extractedText);

      await topicRepository.createMany(
        aiResult.topics.map((topic) => ({
          courseId,
          title: topic.title,
          order: topic.order,
        }))
      );

      await assessmentRepository.createMany(
        aiResult.assessments.map((a) => ({
          courseId,
          title: a.title,
          examDate: a.date,
        }))
      );

      await syllabusRepository.markProcessed(syllabus.id);
      syllabus.aiProcessed = true;
    }

    return toSyllabusResponse(
      syllabus
    );
  }
}

export const syllabusService =
  new SyllabusService();
