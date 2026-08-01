require('dotenv').config();
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
sql`SELECT * FROM courses`.then(res => {
  console.log('Courses:', res.length);
}).catch(console.error);

sql`SELECT status, count(*) FROM study_plans GROUP BY status`.then(res => {
  console.log('Study Plans:', res);
  process.exit(0);
}).catch(console.error);
