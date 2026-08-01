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
  // If there are more topics than available sessions (due to examDate cutoff),
  // keep only as many topics as we have sessions for (they are already prioritized)
  const topicsToSchedule = expandedTopics.slice(0, sessions.length);

  return topicsToSchedule.map((topic, index) => ({
    topicId: topic.topicId,
    title: topic.title,
    part: topic.part,
    totalParts: topic.totalParts, // We could recalculate this, but keeping original totalParts shows it was truncated
    date: sessions[index].date,
    sessionNumber: sessions[index].sessionNumber,
    durationMinutes: sessions[index].durationMinutes,
  }));
}
