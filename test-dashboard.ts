import 'dotenv/config';
import { dashboardRepository } from './src/modules/dashboard/repositories/dashboard.repository';
import { progressService } from './src/modules/progress/services/progress.service';
import { db } from './src/db';

async function test() {
  try {
    const user = await db.query.users.findFirst();
    if (!user) {
      console.log('No user found');
      return;
    }
    const userId = user.id;
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    console.log('Testing getTodayStats...');
    await dashboardRepository.getTodayStats(userId, today, tomorrow);
    
    console.log('Testing getUpcomingAssessments...');
    await dashboardRepository.getUpcomingAssessments(userId, today, 5);
    
    console.log('Testing getCourseCards...');
    await dashboardRepository.getCourseCards(userId);
    
    console.log('Testing getWeeklyProgress...');
    await progressService.getWeeklyProgress(userId);
    
    console.log('Testing getStudyStreak...');
    await progressService.getStudyStreak(userId);
    
    console.log('Testing getOverallStats...');
    await dashboardRepository.getOverallStats(userId);
    
    console.log('ALL PASSED');
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
}

test();
