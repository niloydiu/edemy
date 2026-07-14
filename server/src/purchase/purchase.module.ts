import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { Purchase, PurchaseSchema } from '../schemas/purchase.schema';
import { CourseModule } from '../course/course.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Purchase.name, schema: PurchaseSchema }]),
    CourseModule,
    AuthModule,
  ],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
