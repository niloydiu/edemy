import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course, Lesson, Rating } from '../entities/course.entity';
import { Progress } from '../entities/progress.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(Progress) private progressRepo: Repository<Progress>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(courseData: any, educatorId: string) {
    const { lessons, ...courseFields } = courseData;
    const course = this.courseRepo.create({ ...courseFields, educator: educatorId, enrolledStudents: [] });
    const savedCourse = (await this.courseRepo.save(course)) as any;

    if (lessons && lessons.length > 0) {
      const lessonEntities = lessons.map((l: any, idx: number) =>
        this.lessonRepo.create({ ...l, courseId: savedCourse.id, sortOrder: idx })
      );
      await this.lessonRepo.save(lessonEntities);
    }
    return this.findOne(savedCourse.id);
  }

  async findAll(query: any = {}) {
    const search = query.search || '';
    const type = query.type || '';

    const qb = this.courseRepo.createQueryBuilder('course')
      .where('course.isPublished = :isPublished', { isPublished: true });

    if (search) {
      qb.andWhere(
        '(LOWER(course.courseTitle) LIKE :search OR LOWER(course.courseDescription) LIKE :search OR LOWER(course.institutionName) LIKE :search OR LOWER(course.tutorNames) LIKE :search)',
        { search: `%${search.toLowerCase()}%` }
      );
    }

    const courses = await qb.getMany();
    let enriched = await Promise.all(courses.map(c => this.enrichCourse(c)));

    if (type === 'online') {
      enriched = enriched.filter(c => (c.lessons || []).some(l => l.lessonType === 'online'));
    } else if (type === 'offline') {
      enriched = enriched.filter(c => (c.lessons || []).some(l => l.lessonType === 'offline'));
    }

    return enriched;
  }

  async findOne(id: number | string) {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const course = await this.courseRepo.findOne({ where: { id: numId } });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return this.enrichCourse(course);
  }

  private async enrichCourse(course: Course) {
    const lessons = await this.lessonRepo.find({ where: { courseId: course.id }, order: { sortOrder: 'ASC' } });
    const ratings = await this.ratingRepo.find({ where: { courseId: course.id } });
    return { ...course, lessons, ratings, _id: course.id };
  }

  async update(id: string, updateData: any, userId: string, role: string) {
    const course = await this.findOne(id);
    if (role !== 'admin' && course.educator !== userId) throw new ForbiddenException('Not authorized');
    const { lessons, ...fields } = updateData;
    await this.courseRepo.update(parseInt(id), fields);
    if (lessons) {
      await this.lessonRepo.delete({ courseId: parseInt(id) });
      const newLessons = lessons.map((l: any, idx: number) =>
        this.lessonRepo.create({ ...l, courseId: parseInt(id), sortOrder: idx })
      );
      await this.lessonRepo.save(newLessons);
    }
    return this.findOne(id);
  }

  async delete(id: string, userId: string, role: string) {
    const course = await this.findOne(id);
    if (role !== 'admin' && course.educator !== userId) throw new ForbiddenException('Not authorized');
    await this.lessonRepo.delete({ courseId: parseInt(id) });
    await this.ratingRepo.delete({ courseId: parseInt(id) });
    await this.courseRepo.delete(parseInt(id));
    return { success: true };
  }

  async addRating(id: string, userId: string, rating: number) {
    const courseId = parseInt(id);
    let existing = await this.ratingRepo.findOne({ where: { courseId, userId } });
    if (existing) {
      existing.rating = rating;
      await this.ratingRepo.save(existing);
    } else {
      await this.ratingRepo.save(this.ratingRepo.create({ courseId, userId, rating }));
    }
    return this.findOne(id);
  }

  async enrollStudent(courseId: string | number, userId: string) {
    const numId = typeof courseId === 'string' ? parseInt(courseId) : courseId;
    const course = await this.courseRepo.findOne({ where: { id: numId } });
    if (!course) throw new NotFoundException('Course not found');

    const enrolled = course.enrolledStudents || [];
    if (!enrolled.includes(userId)) {
      course.enrolledStudents = [...enrolled, userId];
      await this.courseRepo.save(course);
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (user) {
      const userCourses = user.enrolledCourses || [];
      if (!userCourses.includes(String(numId))) {
        user.enrolledCourses = [...userCourses, String(numId)];
        await this.userRepo.save(user);
      }
    }

    let progress = await this.progressRepo.findOne({ where: { userId, courseId: numId } });
    if (!progress) {
      progress = this.progressRepo.create({ userId, courseId: numId, completed: false, completedLessons: [] });
      await this.progressRepo.save(progress);
    }
    return { course, progress };
  }

  async getProgress(userId: string, courseId: string) {
    const numId = parseInt(courseId);
    let progress = await this.progressRepo.findOne({ where: { userId, courseId: numId } });
    if (!progress) {
      progress = this.progressRepo.create({ userId, courseId: numId, completed: false, completedLessons: [] });
      await this.progressRepo.save(progress);
    }
    return progress;
  }

  async updateProgress(userId: string, courseId: string, lessonId: string, completed: boolean) {
    const numId = parseInt(courseId);
    let progress = await this.progressRepo.findOne({ where: { userId, courseId: numId } });
    if (!progress) {
      progress = this.progressRepo.create({ userId, courseId: numId, completed: false, completedLessons: [] });
    }

    const list = progress.completedLessons || [];
    const idx = list.indexOf(lessonId);
    if (completed && idx === -1) progress.completedLessons = [...list, lessonId];
    else if (!completed && idx !== -1) progress.completedLessons = list.filter(l => l !== lessonId);

    const lessons = await this.lessonRepo.find({ where: { courseId: numId } });
    progress.completed = lessons.length > 0 && progress.completedLessons.length === lessons.length;
    return this.progressRepo.save(progress);
  }

  async getTutorSchedule(tutorEmail: string) {
    const tutorUser = await this.userRepo.findOne({ where: { email: tutorEmail } });
    const tutorId = tutorUser?.id || '';
    const courses = await this.courseRepo.find({ where: { educator: tutorId } });
    const schedule = [];
    for (const course of courses) {
      const lessons = await this.lessonRepo.find({ where: { courseId: course.id } });
      for (const lesson of lessons) {
        if (lesson.lessonType === 'online' || lesson.lessonType === 'offline') {
          const tutors = lesson.tutors || [];
          const assigned = tutors.some((t: any) => t.email?.toLowerCase() === tutorEmail.toLowerCase()) || course.educator === tutorId;
          if (assigned) {
            schedule.push({ courseId: course.id, courseTitle: course.courseTitle, ...lesson });
          }
        }
      }
    }
    return schedule.sort((a, b) => new Date(a.timeSchedule).getTime() - new Date(b.timeSchedule).getTime());
  }

  async getTutorAnalytics(tutorId: string) {
    const courses = await this.courseRepo.find({ where: { educator: tutorId } });
    const uniqueStudents = new Set<string>();
    let totalEarnings = 0;
    const ratingCounts = [0, 0, 0, 0, 0];
    let totalRatingsSum = 0;
    let totalRatingsCount = 0;

    for (const c of courses) {
      (c.enrolledStudents || []).forEach(s => uniqueStudents.add(s));
      totalEarnings += Number(c.coursePrice) * (c.enrolledStudents?.length || 0);
      const ratings = await this.ratingRepo.find({ where: { courseId: c.id } });
      ratings.forEach(r => {
        const v = Math.round(Number(r.rating));
        if (v >= 1 && v <= 5) { ratingCounts[v - 1]++; totalRatingsSum += Number(r.rating); totalRatingsCount++; }
      });
    }
    return {
      totalCourses: courses.length,
      totalStudents: uniqueStudents.size,
      totalEarnings,
      averageRating: totalRatingsCount ? (totalRatingsSum / totalRatingsCount).toFixed(1) : '4.8',
      ratingDistribution: ratingCounts,
    };
  }
}
