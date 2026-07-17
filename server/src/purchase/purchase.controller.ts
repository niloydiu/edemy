import { Controller, Post, Get, Body, Req, UseGuards, Query, Headers, BadRequestException } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req: any, @Body() body: { courseId: string; amount: number }) {
    return this.purchaseService.createCheckoutSession(req.user.sub, body.courseId, body.amount);
  }

  @Post('webhook')
  async webhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Raw request body is empty');
    }
    try {
      const result = await this.purchaseService.handleWebhook(rawBody, signature);
      return { received: true, processed: !!result };
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getPurchases(@Req() req: any, @Query('studentId') studentId?: string) {
    // Admins and parents can fetch purchases of specific students
    if ((req.user.role === 'admin' || req.user.role === 'parent') && studentId) {
      return this.purchaseService.findByUserId(studentId);
    }
    return this.purchaseService.findByUserId(req.user.sub);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllPurchases() {
    return this.purchaseService.findAll();
  }
}
