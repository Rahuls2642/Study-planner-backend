import 'dotenv/config';
import { getTodayStudyPlanService } from './src/modules/study-plans/services/get-today-study-plan.service';
import { db } from './src/db';

async function test() {
  try {
    const user = await db.query.users.findFirst();
    if (!user) {
      console.log('No user');
      return;
    }
    console.log('Fetching today study plan for user:', user.id);
    const plans = await getTodayStudyPlanService.execute(user.id);
    console.log('Plans:', plans);
  } catch (err: any) {
    console.error('Error:', err);
    console.error(err.stack);
  }
  process.exit(0);
}

test();
