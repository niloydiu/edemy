import { Controller, Post, Get, Body, Req, UseGuards, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(
    @Req() req: any,
    @Body() body: { receiverId: string; message: string; courseId?: string },
  ) {
    return this.chatService.sendMessage(
      req.user.sub,
      body.receiverId,
      body.message,
      body.courseId ? parseInt(body.courseId) : undefined,
    );
  }

  @Get('history')
  async getHistory(@Req() req: any, @Query('recipientId') recipientId: string) {
    return this.chatService.getChatHistory(req.user.sub, recipientId);
  }

  @Get('contacts')
  async getContacts(@Req() req: any) {
    return this.chatService.getContacts(req.user.sub);
  }
}
