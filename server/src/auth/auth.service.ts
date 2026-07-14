import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async googleLogin(body: { googleId: string; email: string; name: string; imageUrl: string; role?: string }) {
    let user = await this.userModel.findById(body.googleId);
    if (!user) {
      user = new this.userModel({
        _id: body.googleId,
        name: body.name,
        email: body.email,
        imageUrl: body.imageUrl,
        role: body.role || 'student',
      });
      await user.save();
    }
    const payload = { sub: user._id, email: user.email, role: user.role, name: user.name };
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
