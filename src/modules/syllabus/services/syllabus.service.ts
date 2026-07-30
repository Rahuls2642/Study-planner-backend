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

    console.log("Uploading to Neon Storage...");
    const uploaded =
      await storageService.upload(
        file,
        `courses/${courseId}/syllabus`
      );
    console.log("✓ Upload successful");

    console.log("Extracting PDF...");
    let extractedText = null;
    if (file.mimetype === "application/pdf") {
      extractedText = await pdfService.extract(file.buffer);
    }
    console.log("✓ Text extracted");
    
    console.log("========== EXTRACTED TEXT ==========");
    console.log(extractedText);
    console.log("===================================");

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
      console.log("Calling Gemini...");
      const aiResult = await geminiService.analyzeSyllabus(extractedText);
      console.log("✓ AI response received");
      
      console.log(
          JSON.stringify(aiResult, null, 2)
      );

      console.log("Saving Topics...");
      await topicRepository.createMany(
        aiResult.topics.map((topic) => ({
          courseId,
          title: topic.title,
          order: topic.order,
        }))
      );
      console.log(`✓ Saved ${aiResult.topics.length} topics`);

      console.log("Saving Assessments...");
      await assessmentRepository.createMany(
        aiResult.assessments.map((a) => ({
          courseId,
          title: a.title,
          examDate: a.date,
        }))
      );
      console.log(`✓ Saved ${aiResult.assessments.length} assessments`);

      console.log("Updating syllabus...");
      await syllabusRepository.markProcessed(syllabus.id);
      syllabus.aiProcessed = true;
      console.log("✓ aiProcessed = true");
    }

    return toSyllabusResponse(
      syllabus
    );
  }
}

export const syllabusService =
  new SyllabusService();
