import { Controller, Get, Put, Delete, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  async getAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.userService.findOne(req.user.sub);
  }

  @Post('wishlist')
  async toggleWishlist(@Req() req: any, @Body() body: { courseId: string }) {
    return this.userService.toggleWishlist(req.user.sub, body.courseId);
  }

  @Get('parent/students')
  @Roles('parent', 'admin')
  async getStudents(@Req() req: any) {
    return this.userService.getLinkedStudents(req.user.sub);
  }

  @Post('link-student')
  @Roles('parent', 'admin')
  async linkStudent(@Req() req: any, @Body() body: { email: string }) {
    return this.userService.linkStudent(req.user.sub, body.email);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
