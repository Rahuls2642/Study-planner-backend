import { syllabi } from "@/db/schema";

export function toSyllabusResponse(
  syllabus: typeof syllabi.$inferSelect
) {
  return {
    id: syllabus.id,
    courseId: syllabus.courseId,
    fileName: syllabus.fileName,
    storageKey: syllabus.storageKey,
    mimeType: syllabus.mimeType,
    aiProcessed: syllabus.aiProcessed,
    createdAt: syllabus.createdAt,
  };
}
