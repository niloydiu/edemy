import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getAll(@Query() query: any) {
    return this.courseService.findAll(query);
  }

  @Get('tutor/schedule')
  @UseGuards(JwtAuthGuard)
  async getTutorSchedule(@Req() req: any) {
    return this.courseService.getTutorSchedule(req.user.email);
  }

  @Get('tutor/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher', 'admin')
  async getTutorAnalytics(@Req() req: any) {
    return this.courseService.getTutorAnalytics(req.user.sub);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  async create(@Body() body: any, @Req() req: any) {
    return this.courseService.create(body, req.user.sub);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.courseService.update(id, body, req.user.sub, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  async delete(@Param('id') id: string, @Req() req: any) {
    return this.courseService.delete(id, req.user.sub, req.user.role);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  async enroll(@Param('id') id: string, @Req() req: any, @Body() body?: { studentId?: string }) {
    // If admin or parent is calling, they might pass studentId
    const targetUserId = (req.user.role === 'admin' || req.user.role === 'parent') && body?.studentId 
      ? body.studentId 
      : req.user.sub;
    return this.courseService.enrollStudent(id, targetUserId);
  }

  @Post(':id/rate')
  @UseGuards(JwtAuthGuard)
  async rate(@Param('id') id: string, @Req() req: any, @Body() body: { rating: number }) {
    return this.courseService.addRating(id, req.user.sub, body.rating);
  }

  @Get(':id/progress')
  @UseGuards(JwtAuthGuard)
  async getProgress(@Param('id') id: string, @Req() req: any, @Query('studentId') studentId?: string) {
    // Parent can track progress by passing studentId
    const targetUserId = (req.user.role === 'parent' || req.user.role === 'admin') && studentId 
      ? studentId 
      : req.user.sub;
    return this.courseService.getProgress(targetUserId, id);
  }

  @Post(':id/progress')
  @UseGuards(JwtAuthGuard)
  async updateProgress(
    @Param('id') id: string,
    @Body() body: { lessonId: string; completed: boolean },
    @Req() req: any,
  ) {
    return this.courseService.updateProgress(req.user.sub, id, body.lessonId, body.completed);
  }
}
