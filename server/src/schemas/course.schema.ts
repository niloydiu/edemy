import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class TutorDetail {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  imageUrl: string;
}

@Schema({ _id: false })
export class Lesson {
  @Prop({ required: true })
  lessonId: string;

  @Prop({ required: true })
  lessonTitle: string;

  @Prop({ required: true, enum: ['pdf', 'link', 'online', 'offline'] })
  lessonType: string;

  @Prop()
  pdfUrl: string;

  @Prop()
  webLink: string;

  @Prop()
  meetLink: string; // Online class meet URL

  @Prop()
  locationDetails: string; // Offline location details

  @Prop({ type: Date })
  timeSchedule: Date; // Time schedule for online/offline classes

  @Prop({ type: [TutorDetail], default: [] })
  tutors: TutorDetail[];

  @Prop({ default: 0 })
  duration: number; // Duration in minutes

  @Prop()
  quizQuestion: string; // Quiz question (optional)

  @Prop({ type: [String], default: [] })
  quizOptions: string[]; // Options (optional)

  @Prop({ type: Number })
  quizCorrectIndex: number; // Correct option index (optional)
}

@Schema({ _id: false })
export class CourseRating {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, min: 0, max: 5 })
  rating: number;
}

@Schema({ timestamps: true, minimize: false })
export class Course extends Document {
  @Prop({ required: true })
  courseTitle: string;

  @Prop({ required: true })
  courseDescription: string;

  @Prop()
  courseThumbnail: string;

  @Prop({ required: true })
  coursePrice: number;

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ required: true, min: 0, max: 100, default: 0 })
  discount: number;

  @Prop({ type: [Lesson], default: [] })
  lessons: Lesson[];

  @Prop({ type: [CourseRating], default: [] })
  ratings: CourseRating[];

  @Prop({ required: true, ref: 'User' })
  educator: string; // Tutor User ID

  @Prop({ type: [String], default: [] })
  enrolledStudents: string[]; // List of Student User IDs
}

export const CourseSchema = SchemaFactory.createForClass(Course);
