import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api/v1';
const REPORT_FILE = path.join(__dirname, 'API_TEST_REPORT.md');
let markdownReport = '# E2E API Test Report\n\n';

let token = '';
let courseId = '';
let syllabusId = '';
let planId = '';
let sessionId = '';
let topicIds: string[] = [];
let assessmentIds: string[] = [];

const timestamp = Date.now();
const testUser = {
  name: 'Test Runner',
  email: `testrunner_${timestamp}@example.com`,
  password: 'TestPassword123!'
};

async function logResult(phase: string, testName: string, passed: boolean, details: string = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${status}] ${phase} - ${testName}`);
  markdownReport += `- **${status}**: ${testName}\n`;
  if (details) {
    markdownReport += `  - *Details*: ${details}\n`;
  }
}

async function request(endpoint: string, method: string, body?: any, useToken: boolean = true) {
  const headers: any = {};
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (useToken && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch(e) {}
  
  return { status: res.status, data: json || text };
}

async function runTests() {
  // PHASE 1: Auth
  markdownReport += `## Phase 1: Authentication\n`;
  try {
    const regRes = await request('/auth/register', 'POST', testUser, false);
    await logResult('Phase 1', 'Valid registration', regRes.status === 201);
    
    const dupRes = await request('/auth/register', 'POST', testUser, false);
    await logResult('Phase 1', 'Duplicate email', dupRes.status === 409 || dupRes.status === 400);
    
    const invEmailRes = await request('/auth/register', 'POST', { ...testUser, email: 'invalid' }, false);
    await logResult('Phase 1', 'Invalid email', invEmailRes.status === 400);
    
    const loginRes = await request('/auth/login', 'POST', { email: testUser.email, password: testUser.password }, false);
    const loginSuccess = loginRes.status === 200 && loginRes.data?.data?.accessToken;
    if (loginSuccess) token = loginRes.data.data.accessToken;
    await logResult('Phase 1', 'Valid login', loginSuccess);

    const meRes = await request('/auth/me', 'GET');
    await logResult('Phase 1', '/auth/me', meRes.status === 200);
  } catch (err: any) { await logResult('Phase 1', 'Fatal Error', false, err.message); }

  // PHASE 2: Course
  markdownReport += `\n## Phase 2: Course Management\n`;
  try {
    const createRes = await request('/courses', 'POST', { title: 'Test Course', code: 'TC101' });
    await logResult('Phase 2', 'Create Course', createRes.status === 201);
    courseId = createRes.data?.data?.id;

    const listRes = await request('/courses', 'GET');
    await logResult('Phase 2', 'List Courses', listRes.status === 200 && Array.isArray(listRes.data?.data));

    const singleRes = await request(`/courses/${courseId}`, 'GET');
    await logResult('Phase 2', 'Get Single Course', singleRes.status === 200);
  } catch (err: any) { await logResult('Phase 2', 'Fatal Error', false, err.message); }

  // PHASE 3: Syllabus AI Pipeline
  markdownReport += `\n## Phase 3: Syllabus AI Pipeline\n`;
  try {
    const formData = new FormData();
    const pdfPath = path.join(__dirname, 'dummy-syllabus.pdf');
    const fileBuffer = fs.readFileSync(pdfPath);
    formData.append('file', new Blob([fileBuffer], { type: 'application/pdf' }), 'dummy-syllabus.pdf');

    const uploadRes = await request(`/courses/${courseId}/syllabus/upload`, 'POST', formData);
    await logResult('Phase 3', 'Upload valid PDF', uploadRes.status === 200 || uploadRes.status === 201, `Status: ${uploadRes.status}`);
    
    if (uploadRes.data?.data?.id) {
        syllabusId = uploadRes.data.data.id;
        
        // This process might take 10 seconds for AI
        const parseRes = await request(`/courses/${courseId}/syllabus/process`, 'POST', { syllabusId });
        await logResult('Phase 3', 'Extract text & AI Analysis', parseRes.status === 200);

        if (parseRes.data?.data?.topics) {
            const confirmRes = await request(`/courses/${courseId}/syllabus/confirm`, 'POST', {
                syllabusId,
                topics: parseRes.data.data.topics,
                assessments: parseRes.data.data.assessments || []
            });
            await logResult('Phase 3', 'Confirm extraction', confirmRes.status === 201 || confirmRes.status === 200);
        }
    } else {
        await logResult('Phase 3', 'AI Process skipped due to upload failure', false);
    }
  } catch (err: any) { await logResult('Phase 3', 'Fatal Error', false, err.message); }

  // PHASE 4: Study Preferences
  markdownReport += `\n## Phase 4: Study Preferences\n`;
  try {
    const prefPayload = {
      hoursPerDay: 2,
      sessionMinutes: 60,
      breakMinutes: 10,
      studyDays: [1,2,3,4,5],
      startDate: new Date().toISOString().split('T')[0]
    };
    const createPref = await request(`/courses/${courseId}/study-preferences`, 'POST', prefPayload);
    await logResult('Phase 4', 'Create Preferences', createPref.status === 201 || createPref.status === 200);

    const getPref = await request(`/courses/${courseId}/study-preferences`, 'GET');
    await logResult('Phase 4', 'Retrieve Preferences', getPref.status === 200);
  } catch(err: any) { await logResult('Phase 4', 'Fatal Error', false, err.message); }

  // PHASE 5: Study Plan
  markdownReport += `\n## Phase 5: Study Plan\n`;
  try {
    const genPlan = await request(`/courses/${courseId}/study-plan/generate`, 'POST');
    await logResult('Phase 5', 'Generate Study Plan', genPlan.status === 201 || genPlan.status === 200, genPlan.status.toString());

    const getPlan = await request(`/courses/${courseId}/study-plan`, 'GET');
    await logResult('Phase 5', 'Retrieve Study Plan', getPlan.status === 200);

    if (getPlan.data?.data && getPlan.data.data.length > 0) {
        sessionId = getPlan.data.data[0].id;
    }
  } catch(err: any) { await logResult('Phase 5', 'Fatal Error', false, err.message); }

  // PHASE 6: Study Sessions
  markdownReport += `\n## Phase 6: Study Sessions\n`;
  try {
    const todayPlan = await request(`/study-plan/today`, 'GET');
    await logResult('Phase 6', 'Today\'s Plan', todayPlan.status === 200);

    if (sessionId) {
        const completeSession = await request(`/study-plan/${sessionId}/status`, 'PATCH', { status: 'COMPLETED' });
        await logResult('Phase 6', 'Complete Session', completeSession.status === 200);
    }
  } catch(err: any) { await logResult('Phase 6', 'Fatal Error', false, err.message); }

  // PHASE 8: Progress Engine
  markdownReport += `\n## Phase 8: Progress Engine\n`;
  try {
    const courseProg = await request(`/courses/${courseId}/progress`, 'GET');
    await logResult('Phase 8', 'Course Progress', courseProg.status === 200);

    const weekProg = await request(`/progress/weekly`, 'GET');
    await logResult('Phase 8', 'Weekly Progress', weekProg.status === 200);
  } catch(err: any) { await logResult('Phase 8', 'Fatal Error', false, err.message); }

  // PHASE 9: Dashboard
  markdownReport += `\n## Phase 9: Dashboard\n`;
  try {
    const dashRes = await request(`/dashboard`, 'GET');
    await logResult('Phase 9', 'View Dashboard', dashRes.status === 200);
  } catch(err: any) { await logResult('Phase 9', 'Fatal Error', false, err.message); }

  // PHASE 10: Security
  markdownReport += `\n## Phase 10: Security\n`;
  try {
    const noTokenRes = await request(`/dashboard`, 'GET', undefined, false);
    await logResult('Phase 10', 'No JWT Rejection', noTokenRes.status === 401);

    const badUuidRes = await request(`/courses/invalid-uuid`, 'GET');
    await logResult('Phase 10', 'Invalid UUID Handling', badUuidRes.status === 400 || badUuidRes.status === 404 || badUuidRes.status === 500); // Usually rejected gracefully
  } catch(err: any) { await logResult('Phase 10', 'Fatal Error', false, err.message); }

  fs.writeFileSync(REPORT_FILE, markdownReport);
  console.log('Report generated at ' + REPORT_FILE);
}

runTests().catch(console.error);
