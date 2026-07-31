export interface StudyPreference {
  hoursPerDay: number;
  sessionMinutes: number;
  breakMinutes: number;
  studyDays: number[];
  startDate: Date;
}

export interface StudySession {
  date: string;
  sessionNumber: number;
  durationMinutes: number;
}

export function generateStudySessions(
  preference: StudyPreference,
  totalDays: number
): StudySession[] {
  const sessions: StudySession[] = [];

  const currentDate = new Date(preference.startDate);

  while (sessions.length < totalDays * preference.hoursPerDay) {
    const day = currentDate.getDay();

    if (preference.studyDays.includes(day)) {
      for (
        let session = 1;
        session <= preference.hoursPerDay;
        session++
      ) {
        sessions.push({
          date: currentDate.toISOString().split("T")[0],
          sessionNumber: session,
          durationMinutes: preference.sessionMinutes,
        });
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return sessions;
}
