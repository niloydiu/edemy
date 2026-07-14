import { Controller, Post, Get, Body, Req, UseGuards, Query } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/purchases')
@UseGuards(JwtAuthGuard)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  async checkout(@Req() req: any, @Body() body: { courseId: string; amount: number }) {
    return this.purchaseService.createPurchase(req.user.sub, body.courseId, body.amount);
  }

  @Get()
  async getPurchases(@Req() req: any, @Query('studentId') studentId?: string) {
    // Admins and parents can fetch purchases of specific students
    if ((req.user.role === 'admin' || req.user.role === 'parent') && studentId) {
      return this.purchaseService.findByUserId(studentId);
    }
    return this.purchaseService.findByUserId(req.user.sub);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllPurchases() {
    return this.purchaseService.findAll();
  }
}
