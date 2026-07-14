import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Purchase extends Document {
  @Prop({ required: true, ref: 'Course' })
  courseId: string;

  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: string;

  @Prop()
  paymentIntentId: string;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
