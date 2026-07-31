import { StudySession } from "./generateStudySessions";

export interface TopicForScheduling {
  id: string;
  title: string;
}

export interface ScheduledTopic {
  topicId: string;
  title: string;
  date: string;
  sessionNumber: number;
  durationMinutes: number;
}

export function assignTopicsToSessions(
  topics: TopicForScheduling[],
  sessions: StudySession[]
): ScheduledTopic[] {
  if (topics.length > sessions.length) {
    throw new Error(
      "Not enough study sessions to schedule all topics."
    );
  }

  return topics.map((topic, index) => ({
    topicId: topic.id,
    title: topic.title,
    date: sessions[index].date,
    sessionNumber: sessions[index].sessionNumber,
    durationMinutes: sessions[index].durationMinutes,
  }));
}
