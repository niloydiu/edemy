import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async googleLogin(@Body() body: { googleId: string; email: string; name: string; imageUrl: string; role?: string }) {
    return this.authService.googleLogin(body);
  }
}
