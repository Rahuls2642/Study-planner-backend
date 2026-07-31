import { StudySession } from "./generateStudySessions";
import { ExpandedTopic } from "./expandTopics";

export interface ScheduledTopic {
  topicId: string;
  title: string;
  part: number;
  totalParts: number;
  date: string;
  sessionNumber: number;
  durationMinutes: number;
}

export function assignTopicsToSessions(
  expandedTopics: ExpandedTopic[],
  sessions: StudySession[]
): ScheduledTopic[] {
  if (expandedTopics.length > sessions.length) {
    throw new Error(
      "Not enough study sessions to schedule all topic parts."
    );
  }

  return expandedTopics.map((topic, index) => ({
    topicId: topic.topicId,
    title: topic.title,
    part: topic.part,
    totalParts: topic.totalParts,
    date: sessions[index].date,
    sessionNumber: sessions[index].sessionNumber,
    durationMinutes: sessions[index].durationMinutes,
  }));
}
