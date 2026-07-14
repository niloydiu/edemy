import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ChatModule } from './chat/chat.module';
import { SeedService } from './seed.service';
import { User, UserSchema } from './schemas/user.schema';
import { Course, CourseSchema } from './schemas/course.schema';
import { Progress, ProgressSchema } from './schemas/progress.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/edemy-nestjs'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Progress.name, schema: ProgressSchema },
    ]),
    AuthModule,
    UserModule,
    CourseModule,
    PurchaseModule,
    ChatModule,
  ],
  providers: [SeedService],
})
export class AppModule {}

