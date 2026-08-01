export interface StudyPreference {
  hoursPerDay: number;
  minutesPerDay: number;
  sessionMinutes: number;
  breakMinutes: number;
  studyDays: number[];
  startDate: Date;
  examDate?: Date | null;
}

export interface StudySession {
  date: string;
  sessionNumber: number;
  durationMinutes: number;
}

export function generateStudySessions(
  preference: StudyPreference,
  totalSessionsNeeded: number
): StudySession[] {
  const sessions: StudySession[] = [];

  const currentDate = new Date(preference.startDate);
  const endDate = preference.examDate ? new Date(preference.examDate) : null;
  const dailyStudyMinutes = (preference.hoursPerDay * 60) + preference.minutesPerDay;
  const sessionsPerDay = Math.max(1, Math.floor(dailyStudyMinutes / preference.sessionMinutes));

  while (sessions.length < totalSessionsNeeded) {
    if (endDate && currentDate > endDate) {
      break;
    }

    const day = currentDate.getDay();

    if (preference.studyDays.includes(day)) {
      for (
        let session = 1;
        session <= sessionsPerDay;
        session++
      ) {
        if (sessions.length >= totalSessionsNeeded) break;
        
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
