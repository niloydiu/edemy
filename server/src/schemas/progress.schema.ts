import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Progress extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, ref: 'Course' })
  courseId: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: [String], default: [] })
  completedLessons: string[]; // List of completed lessonIds
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
