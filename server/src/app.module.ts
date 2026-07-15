import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SeedService } from './seed.service';
import { User } from './entities/user.entity';
import { Course, Lesson, Rating } from './entities/course.entity';
import { Progress } from './entities/progress.entity';
import { Purchase } from './entities/purchase.entity';
import { Message } from './entities/message.entity';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pass = configService.get('DB_PASSWORD');
        console.log('DEBUG DB_PASSWORD TYPE:', typeof pass, 'VALUE:', JSON.stringify(pass));
        const url = configService.get<string>('DATABASE_URL');
        if (url) {
          return {
            type: 'postgres',
            url,
            entities: [User, Course, Lesson, Rating, Progress, Purchase, Message],
            synchronize: true,
            ssl: url.includes('neon') ? { rejectUnauthorized: false } : false,
            logging: false,
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_DATABASE', 'edemy'),
          entities: [User, Course, Lesson, Rating, Progress, Purchase, Message],
          synchronize: true,
          logging: false,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Course, Lesson, Rating, Progress, Purchase, Message]),
    AuthModule,
    UserModule,
    CourseModule,
    PurchaseModule,
    ChatModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [SeedService],
})
export class AppModule {}
