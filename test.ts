import 'dotenv/config';
import { db } from './src/db';
import { studyPlans } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const plans = await db.query.studyPlans.findMany();
  
  if (plans.length === 0) return;

  // Find min date
  const minDate = new Date(Math.min(...plans.map(p => p.studyDate.getTime())));
  const today = new Date();
  today.setUTCHours(0,0,0,0);

  // Diff in days
  const diffTime = minDate.getTime() - today.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  for (const plan of plans) {
    const newDate = new Date(plan.studyDate);
    newDate.setDate(newDate.getDate() - diffDays);
    await db.update(studyPlans).set({ studyDate: newDate }).where(eq(studyPlans.id, plan.id));
  }
  
  console.log("Updated study plans dates to start from today!");
  process.exit(0);
}
main();
