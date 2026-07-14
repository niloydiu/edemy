#!/bin/bash

# Base API URL
API_URL="http://localhost:5000/api"

echo "=== 1. GOOGLE SIGN IN (STUDENT) ==="
STUDENT_AUTH=$(curl -s -X POST "$API_URL/auth/google" \
  -H "Content-Type: application/json" \
  -d '{"googleId":"student_test_123","email":"jane@student.com","name":"Jane Student","imageUrl":"https://api.dicebear.com/7.x/bottts/svg?seed=Jane","role":"student"}')

STUDENT_TOKEN=$(echo $STUDENT_AUTH | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Student Token generated: $STUDENT_TOKEN"
echo ""

echo "=== 2. GOOGLE SIGN IN (TUTOR) ==="
TUTOR_AUTH=$(curl -s -X POST "$API_URL/auth/google" \
  -H "Content-Type: application/json" \
  -d '{"googleId":"teacher_test_123","email":"prof@teacher.com","name":"Professor Tech","imageUrl":"https://api.dicebear.com/7.x/bottts/svg?seed=Prof","role":"teacher"}')

TUTOR_TOKEN=$(echo $TUTOR_AUTH | grep -o '"token":"[^"]*' | grep -o '[^from]*' | head -n 1 | cut -d'"' -f3)
# Fallback token extraction if grep is tricky in shell
TUTOR_TOKEN=$(echo $TUTOR_AUTH | sed 's/.*"token":"\([^"]*\)".*/\1/')
echo "Tutor Token generated: $TUTOR_TOKEN"
echo ""

echo "=== 3. GET ALL COURSES ==="
curl -s -X GET "$API_URL/courses" | jq . || curl -s -X GET "$API_URL/courses"
echo ""
echo ""

echo "=== 4. CREATE COURSE (AS TUTOR) ==="
CREATE_COURSE_RES=$(curl -s -X POST "$API_URL/courses" \
  -H "Authorization: Bearer $TUTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseTitle": "GSAP Advanced Animations",
    "courseDescription": "Master scroll triggers, magnetic buttons, and neon canvas particle grids.",
    "coursePrice": 129.99,
    "discount": 5,
    "lessons": [
      {
        "lessonId": "lesson_gsap_1",
        "lessonTitle": "ScrollTrigger Physics (Online)",
        "lessonType": "online",
        "meetLink": "https://meet.google.com/xyz-abc-123",
        "timeSchedule": "2026-08-01T14:00:00Z",
        "tutors": [{"name": "Professor Tech", "email": "prof@teacher.com"}],
        "duration": 45
      },
      {
        "lessonId": "lesson_gsap_2",
        "lessonTitle": "Canvas Neon Particle Labs (Offline)",
        "lessonType": "offline",
        "locationDetails": "Silicon Valley Hub Room 102",
        "timeSchedule": "2026-08-03T10:00:00Z",
        "tutors": [{"name": "Professor Tech", "email": "prof@teacher.com"}],
        "duration": 90
      }
    ]
  }')
echo $CREATE_COURSE_RES
COURSE_ID=$(echo $CREATE_COURSE_RES | sed 's/.*"_id":"\([^"]*\)".*/\1/')
echo "Created Course ID: $COURSE_ID"
echo ""

echo "=== 5. ENROLL/PURCHASE COURSE (AS STUDENT) ==="
curl -s -X POST "$API_URL/purchases" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"courseId\":\"$COURSE_ID\",\"amount\":129.99}"
echo ""
echo ""

echo "=== 6. CHECK STUDENT PROGRESS ==="
curl -s -X GET "$API_URL/courses/$COURSE_ID/progress" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
echo ""
echo ""

echo "=== 7. MARK LESSON AS COMPLETED ==="
curl -s -X POST "$API_URL/courses/$COURSE_ID/progress" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId":"lesson_gsap_1","completed":true}'
echo ""
echo ""

echo "=== 8. CHECK UPDATED STUDENT PROGRESS ==="
curl -s -X GET "$API_URL/courses/$COURSE_ID/progress" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
echo ""
echo ""

echo "=== 9. SEND MESSAGE (STUDENT TO TUTOR) ==="
curl -s -X POST "$API_URL/chat" \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiverId":"teacher_test_123","message":"Professor, will we cover custom canvas rendering in the GSAP lab?"}'
echo ""
echo ""

echo "=== 10. GET CHAT HISTORY ==="
curl -s -X GET "$API_URL/chat/history?recipientId=teacher_test_123" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
echo ""
echo ""
