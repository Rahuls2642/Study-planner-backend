export function prioritizeTopics(topics: any[]) {
  return [...topics].sort((a, b) => {
    if (!a.assessment && !b.assessment) return 0;
    if (!a.assessment) return 1;
    if (!b.assessment) return -1;

    return (
      new Date(a.assessment.date || a.assessment.examDate).getTime() -
      new Date(b.assessment.date || b.assessment.examDate).getTime()
    );
  });
}
