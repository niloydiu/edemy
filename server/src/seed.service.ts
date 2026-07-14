import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { Course } from './schemas/course.schema';
import { Progress } from './schemas/progress.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
  ) {}

  async onApplicationBootstrap() {
    console.log('Checking database seed data...');
    const userCount = await this.userModel.countDocuments();
    if (userCount === 0) {
      console.log('No users found. Seeding initial data...');
      
      // 1. Seed Users
      const users = [
        {
          _id: 'student_test_123',
          name: 'Jane Student',
          email: 'jane@student.com',
          imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          role: 'student',
          parentId: 'parent_test_123',
          studentIds: [],
          enrolledCourses: [],
        },
        {
          _id: 'teacher_test_123',
          name: 'Professor Tech',
          email: 'prof@teacher.com',
          imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          role: 'teacher',
          parentId: null,
          studentIds: [],
          enrolledCourses: [],
        },
        {
          _id: 'parent_test_123',
          name: 'Robert Parent',
          email: 'robert@parent.com',
          imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          role: 'parent',
          parentId: null,
          studentIds: ['student_test_123'],
          enrolledCourses: [],
        },
        {
          _id: 'admin_test_123',
          name: 'Edemy Administrator',
          email: 'admin@edemy.com',
          imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
          role: 'admin',
          parentId: null,
          studentIds: [],
          enrolledCourses: [],
        },
      ];

      for (const u of users) {
        await new this.userModel(u).save();
      }
      console.log('Users seeded.');

      // 2. Seed Courses
      const futureDate1 = new Date();
      futureDate1.setDate(futureDate1.getDate() + 1); // Tomorrow
      futureDate1.setHours(15, 0, 0, 0);

      const futureDate2 = new Date();
      futureDate2.setDate(futureDate2.getDate() + 3); // In 3 days
      futureDate2.setHours(10, 0, 0, 0);

      const courses = [
        {
          courseTitle: 'Introduction to Futuristic Web Design',
          courseDescription: 'Learn how to construct stunning neon, cyber-tech, and glassmorphic user interfaces using Next.js, Framer Motion, and GSAP.',
          courseThumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500',
          coursePrice: 99.99,
          isPublished: true,
          discount: 10,
          educator: 'teacher_test_123',
          lessons: [
            {
              lessonId: 'lesson_1_pdf',
              lessonTitle: 'Introduction to Neon Aesthetics',
              lessonType: 'pdf',
              pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              duration: 15,
              quizQuestion: 'Which color model is standard for glowing glassmorphism gradients?',
              quizOptions: ['RGBA/HSLA', 'CMYK', 'Grayscale', 'Pantone'],
              quizCorrectIndex: 0,
              tutors: [
                {
                  name: 'Professor Tech',
                  email: 'prof@teacher.com',
                  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                },
              ],
            },
            {
              lessonId: 'lesson_2_link',
              lessonTitle: 'Inspirational Futuristic UIs',
              lessonType: 'link',
              webLink: 'https://codepen.io',
              duration: 10,
              tutors: [
                {
                  name: 'Professor Tech',
                  email: 'prof@teacher.com',
                  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                },
              ],
            },
            {
              lessonId: 'lesson_3_online',
              lessonTitle: 'GSAP Animation Masterclass (Online)',
              lessonType: 'online',
              meetLink: 'https://meet.google.com/abc-defg-hij',
              timeSchedule: futureDate1,
              duration: 60,
              quizQuestion: 'What GSAP plugin handles scroll-driven micro-animations?',
              quizOptions: ['ScrollTrigger', 'Draggable', 'TextPlugin', 'SplitText'],
              quizCorrectIndex: 0,
              tutors: [
                {
                  name: 'Professor Tech',
                  email: 'prof@teacher.com',
                  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                },
              ],
            },
            {
              lessonId: 'lesson_4_offline',
              lessonTitle: 'Framer Motion Live Lab (Offline)',
              lessonType: 'offline',
              locationDetails: 'Silicon Valley Labs, Block C, Room 402',
              timeSchedule: futureDate2,
              duration: 120,
              tutors: [
                {
                  name: 'Professor Tech',
                  email: 'prof@teacher.com',
                  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                },
              ],
            },
          ],
          enrolledStudents: ['student_test_123'],
          ratings: [
            { userId: 'student_test_123', rating: 5 },
          ],
        },
      ];

      for (const c of courses) {
        const savedCourse = await new this.courseModel(c).save();
        
        // Update user enrolled courses
        await this.userModel.findByIdAndUpdate('student_test_123', {
          $push: { enrolledCourses: savedCourse._id }
        });

        // Add progress tracking
        await new this.progressModel({
          userId: 'student_test_123',
          courseId: savedCourse._id,
          completed: false,
          completedLessons: ['lesson_1_pdf'],
        }).save();
      }

      console.log('Courses & Progress seeded.');
    } else {
      console.log('Database already has data. Seeding skipped.');
    }
  }
}
