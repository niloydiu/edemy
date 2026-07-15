import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('tutors')
export class Tutor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ type: 'int' })
  lessonId: number;
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lessonId: string; // Readable lesson ID (legacy compat)

  @Column({ type: 'varchar', length: 500 })
  lessonTitle: string;

  @Column({ type: 'varchar', length: 50 })
  lessonType: string; // pdf | link | online | offline

  @Column({ type: 'text', nullable: true })
  pdfUrl: string;

  @Column({ type: 'text', nullable: true })
  webLink: string;

  @Column({ type: 'text', nullable: true })
  meetLink: string;

  @Column({ type: 'text', nullable: true })
  locationDetails: string;

  @Column({ type: 'text', nullable: true })
  videoUrl: string;

  @Column({ type: 'timestamptz', nullable: true })
  timeSchedule: Date;

  @Column({ type: 'int', default: 0 })
  duration: number; // minutes

  @Column({ type: 'text', nullable: true })
  quizQuestion: string;

  @Column({ type: 'simple-array', nullable: true })
  quizOptions: string[];

  @Column({ type: 'int', nullable: true })
  quizCorrectIndex: number;

  @Column({ type: 'int' })
  courseId: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  // tutors stored as JSON string
  @Column({ type: 'jsonb', nullable: true, default: '[]' })
  tutors: { name: string; email: string; imageUrl?: string }[];
}

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @Column({ type: 'int' })
  courseId: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  courseTitle: string;

  @Column({ type: 'text' })
  courseDescription: string;

  @Column({ type: 'text', nullable: true })
  courseThumbnail: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  coursePrice: number;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @Column({ type: 'int', default: 0 })
  discount: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  educator: string; // User ID

  @Column({ type: 'varchar', length: 100, nullable: true })
  category: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  level: string; // beginner | intermediate | advanced

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({ type: 'simple-array', nullable: true, default: '' })
  enrolledStudents: string[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  institutionName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  tutorNames: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations (loaded via separate queries for simplicity)
  lessons?: Lesson[];
  ratings?: Rating[];
}
