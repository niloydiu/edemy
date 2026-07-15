import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { CourseService } from '../course/course.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase) private purchaseRepo: Repository<Purchase>,
    private courseService: CourseService,
  ) {}

  async createPurchase(userId: string, courseId: string, amount: number) {
    const purchase = this.purchaseRepo.create({
      userId,
      courseId: parseInt(courseId),
      amount,
      status: 'completed',
      paymentIntentId: 'mock_pi_' + Math.random().toString(36).substring(7),
    });
    await this.purchaseRepo.save(purchase);
    await this.courseService.enrollStudent(courseId, userId);
    return purchase;
  }

  async findAll() {
    return this.purchaseRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findByUserId(userId: string) {
    return this.purchaseRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }
}
