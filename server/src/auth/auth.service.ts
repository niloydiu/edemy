import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async googleLogin(body: { googleId: string; email: string; name: string; imageUrl?: string; role?: string }) {
    let user = await this.userRepo.findOne({ where: { id: body.googleId } });
    if (!user) {
      user = this.userRepo.create({
        id: body.googleId,
        name: body.name,
        email: body.email,
        imageUrl: body.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(body.name)}`,
        role: body.role || 'student',
        studentIds: [],
        enrolledCourses: [],
      });
      await this.userRepo.save(user);
    }
    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
