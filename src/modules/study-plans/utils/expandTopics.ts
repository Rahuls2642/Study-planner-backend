export interface TopicForScheduling {
  id: string;
  title: string;
  estimatedDurationMinutes: number;
}

export interface ExpandedTopic {
  topicId: string;
  title: string;
  part: number;
  totalParts: number;
}

export function expandTopics(
  topics: TopicForScheduling[],
  sessionMinutes: number
): ExpandedTopic[] {
  const expanded: ExpandedTopic[] = [];

  for (const topic of topics) {
    const totalParts = Math.ceil(
      topic.estimatedDurationMinutes / sessionMinutes
    );

    for (let part = 1; part <= totalParts; part++) {
      expanded.push({
        topicId: topic.id,
        title: topic.title,
        part,
        totalParts,
      });
    }
  }

  return expanded;
}
