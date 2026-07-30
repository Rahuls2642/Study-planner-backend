import { courseRepository } from "@/modules/courses/repositories/course.repository";
import { geminiService } from "@/services/ai/gemini.service";
import { pdfService } from "@/services/pdf/pdf.service";
import { ApiError } from "@/config/utils/ApiError";

class UploadSyllabusService {
  async execute(
    courseId: string,
    userId: string,
    file?: Express.Multer.File
  ) {
    const course = await courseRepository.findById(courseId, userId);

    if (!course) {
      throw new ApiError(404, "Course not found.");
    }

    if (!file || file.mimetype !== "application/pdf") {
      throw new ApiError(400, "Please upload a valid PDF file.");
    }

    console.log("Extracting PDF...");
    const extractedText = await pdfService.extract(file.buffer);
    console.log("✓ Text extracted");

    if (!extractedText) {
      throw new ApiError(400, "Could not extract text from PDF.");
    }

    console.log("Calling Gemini...");
    const aiResult = await geminiService.analyzeSyllabus(extractedText);
    console.log("✓ AI response received");

    return {
      rawText: extractedText,
      ...aiResult,
    };
  }
}

export const uploadSyllabusService = new UploadSyllabusService();
