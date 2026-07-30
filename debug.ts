import "dotenv/config";
import { db } from "./src/db";
import { topics, courses, users } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Analyzing topic ID: 2499cb8e-ad14-4863-b889-f037188bf6ab");
  
  const [topic] = await db.select().from(topics).where(eq(topics.id, "2499cb8e-ad14-4863-b889-f037188bf6ab"));
  if (!topic) {
    console.log("Topic not found in DB.");
    process.exit(0);
  }
  
  console.log("Found topic:", topic);
  
  const [course] = await db.select().from(courses).where(eq(courses.id, topic.courseId));
  console.log("Found course:", course);
  
  const allUsers = await db.select().from(users);
  console.log("All users in DB:", allUsers.map(u => ({ id: u.id, email: u.email })));
  
  process.exit(0);
}

main().catch(console.error);
