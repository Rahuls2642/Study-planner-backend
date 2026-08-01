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
  
  // Calculate total parts for each topic
  const topicsWithParts = topics.map(topic => ({
    topic,
    totalParts: Math.ceil(topic.estimatedDurationMinutes / sessionMinutes),
    currentPart: 1
  }));

  let hasMoreParts = true;
  while (hasMoreParts) {
    hasMoreParts = false;
    for (const t of topicsWithParts) {
      if (t.currentPart <= t.totalParts) {
        expanded.push({
          topicId: t.topic.id,
          title: t.topic.title,
          part: t.currentPart,
          totalParts: t.totalParts,
        });
        t.currentPart++;
        hasMoreParts = true;
      }
    }
  }

  return expanded;
}
