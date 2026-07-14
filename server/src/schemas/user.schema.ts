import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  _id: string; // Google User ID

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true, enum: ['student', 'teacher', 'parent', 'admin'], default: 'student' })
  role: string;

  @Prop({ type: String, ref: 'User', default: null })
  parentId: string;

  @Prop({ type: [String], default: [] })
  studentIds: string[];

  @Prop({ type: [String], default: [] })
  enrolledCourses: string[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
