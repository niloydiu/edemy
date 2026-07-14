const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING NESTJS LMS API TEST SUITE ---');

  try {
    // 1. Google sign in student
    console.log('\n[1] Testing Student Sign In...');
    const studentRes = await axios.post(`${API_URL}/auth/google`, {
      googleId: 'student_test_123',
      email: 'jane@student.com',
      name: 'Jane Student',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Jane',
      role: 'student'
    });
    const studentToken = studentRes.data.token;
    console.log('✓ Student Sign In Successful! Token received.');

    // 2. Google sign in tutor
    console.log('\n[2] Testing Tutor Sign In...');
    const tutorRes = await axios.post(`${API_URL}/auth/google`, {
      googleId: 'teacher_test_123',
      email: 'prof@teacher.com',
      name: 'Professor Tech',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Prof',
      role: 'teacher'
    });
    const tutorToken = tutorRes.data.token;
    console.log('✓ Tutor Sign In Successful! Token received.');

    // 3. Google sign in admin
    console.log('\n[3] Testing Admin Sign In...');
    const adminRes = await axios.post(`${API_URL}/auth/google`, {
      googleId: 'admin_test_123',
      email: 'admin@edemy.com',
      name: 'Edemy Administrator',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      role: 'admin'
    });
    const adminToken = adminRes.data.token;
    console.log('✓ Admin Sign In Successful! Token received.');

    // 4. Get all courses
    console.log('\n[4] Testing Courses List Retrieval...');
    const coursesRes = await axios.get(`${API_URL}/courses`);
    console.log(`✓ Fetched ${coursesRes.data.length} course blueprints from db.`);

    // 5. Create a course (Tutor)
    console.log('\n[5] Testing Course Creation...');
    const newCourseRes = await axios.post(
      `${API_URL}/courses`,
      {
        courseTitle: 'GSAP scrolltrig animations',
        courseDescription: 'Master web motion physics.',
        coursePrice: 129.99,
        discount: 5,
        lessons: [
          {
            lessonId: 'lesson_gsap_1',
            lessonTitle: 'ScrollTrigger physics (Online)',
            lessonType: 'online',
            meetLink: 'https://meet.google.com/xyz-abc-123',
            timeSchedule: new Date(Date.now() + 86400000), // tomorrow
            tutors: [{ name: 'Professor Tech', email: 'prof@teacher.com' }],
            duration: 45
          }
        ]
      },
      { headers: { Authorization: `Bearer ${tutorToken}` } }
    );
    const courseId = newCourseRes.data._id;
    console.log(`✓ Course created successfully! ID: ${courseId}`);

    // 6. Purchase/enroll course (Student)
    console.log('\n[6] Testing Course Purchase & Enrollment...');
    const purchaseRes = await axios.post(
      `${API_URL}/purchases`,
      { courseId, amount: 129.99 },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log(`✓ Purchase successful! Status: ${purchaseRes.data.status}`);

    // 7. Track course progress
    console.log('\n[7] Testing Progress Tracking (Initial State)...');
    const initialProgressRes = await axios.get(`${API_URL}/courses/${courseId}/progress`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✓ Student progress checked. Completed lessons: [${initialProgressRes.data.completedLessons}]`);

    // 8. Update course progress
    console.log('\n[8] Updating Progress (Mark Completed)...');
    const updatedProgressRes = await axios.post(
      `${API_URL}/courses/${courseId}/progress`,
      { lessonId: 'lesson_gsap_1', completed: true },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log(`✓ Progress updated. Completed lessons: [${updatedProgressRes.data.completedLessons}]`);

    // 9. Send Chat message
    console.log('\n[9] Sending Message (Student -> Tutor)...');
    const chatRes = await axios.post(
      `${API_URL}/chat`,
      { receiverId: 'teacher_test_123', message: 'Hello prof!' },
      { headers: { Authorization: `Bearer ${studentToken}` } }
    );
    console.log('✓ Message sent successfully.');

    // 10. Fetch chat history
    console.log('\n[10] Reading Chat Logs...');
    const chatHistoryRes = await axios.get(`${API_URL}/chat/history?recipientId=teacher_test_123`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✓ Fetched ${chatHistoryRes.data.length} chat message logs.`);

    console.log('\n======================================');
    console.log('ALL NESTJS API TEST SCRIPTS PASSED SUCCESSFULLY!');
    console.log('======================================');
  } catch (err) {
    console.error('\n❌ Test Failure detected in API chain:');
    if (err.response) {
      console.error(`Status: ${err.response.status}`);
      console.error(err.response.data);
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
}

runTests();
