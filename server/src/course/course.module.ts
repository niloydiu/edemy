import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course, CourseSchema } from '../schemas/course.schema';
import { Progress, ProgressSchema } from '../schemas/progress.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
