import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { CourseService } from '../course/course.service';
import Stripe from 'stripe';

@Injectable()
export class PurchaseService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Purchase) private purchaseRepo: Repository<Purchase>,
    private courseService: CourseService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'mock_secret_key', {
      apiVersion: '2026-06-24.dahlia' as any,
    });
  }

  async createCheckoutSession(userId: string, courseId: string, amount: number) {
    const course = await this.courseService.findOne(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.courseTitle,
              description: course.courseDescription?.substring(0, 500) || '',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${courseId}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses/${courseId}?canceled=true`,
      metadata: {
        userId,
        courseId,
      },
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('Stripe Webhook Secret not configured');
    }
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, courseId } = session.metadata || {};
      const amount = session.amount_total ? session.amount_total / 100 : 0;
      if (userId && courseId) {
        const paymentIntentId = typeof session.payment_intent === 'string' 
          ? session.payment_intent 
          : (session.id || 'stripe_checkout_session');
        const purchase = this.purchaseRepo.create({
          userId,
          courseId: parseInt(courseId),
          amount,
          status: 'completed',
          paymentIntentId,
        });
        await this.purchaseRepo.save(purchase);
        await this.courseService.enrollStudent(courseId, userId);
        return purchase;
      }
    }
    return null;
  }

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
