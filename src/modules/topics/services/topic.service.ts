import { ApiError } from "@/config/utils/ApiError";
import { topicRepository } from "../repositories/topic.repository";
import { toTopicResponse } from "../mappers/topic.mapper";

class TopicService {
  async updateProgress(topicId: string, userId: string, completed: boolean) {
    const topic = await topicRepository.findByIdWithCourse(topicId);

    if (!topic) {
      throw new ApiError(404, "Topic not found");
    }

    if (topic.course?.userId !== userId) {
      throw new ApiError(403, "Forbidden: You do not own this course");
    }

    const updated = await topicRepository.updateProgress(topicId, completed);
    return toTopicResponse(updated);
  }
}

export const topicService = new TopicService();
