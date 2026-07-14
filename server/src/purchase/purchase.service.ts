import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase } from '../schemas/purchase.schema';
import { CourseService } from '../course/course.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    private courseService: CourseService,
  ) {}

  async createPurchase(userId: string, courseId: string, amount: number) {
    const purchase = new this.purchaseModel({
      userId,
      courseId,
      amount,
      status: 'completed', // Immediately completed for our payment flow
      paymentIntentId: 'mock_pi_' + Math.random().toString(36).substring(7),
    });
    await purchase.save();

    // Auto-enroll the student in the course
    await this.courseService.enrollStudent(courseId, userId);

    return purchase;
  }

  async findAll() {
    return this.purchaseModel.find().populate('courseId').populate('userId').exec();
  }

  async findByUserId(userId: string) {
    return this.purchaseModel.find({ userId }).populate('courseId').exec();
  }
}
