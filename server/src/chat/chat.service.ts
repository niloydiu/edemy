import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or, Equal } from 'typeorm';
import { Message } from '../entities/message.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async sendMessage(senderId: string, receiverId: string, messageText: string, courseId?: number) {
    const msg = this.messageRepo.create({ senderId, receiverId, message: messageText, courseId });
    return this.messageRepo.save(msg);
  }

  async getChatHistory(userId1: string, userId2: string) {
    const messages = await this.messageRepo.find({ order: { createdAt: 'ASC' } });
    return messages.filter(m =>
      (m.senderId === userId1 && m.receiverId === userId2) ||
      (m.senderId === userId2 && m.receiverId === userId1)
    );
  }

  async getContacts(userId: string) {
    const messages = await this.messageRepo.find();
    const contactIds = new Set<string>();
    messages.forEach(m => {
      if (m.senderId === userId) contactIds.add(m.receiverId);
      if (m.receiverId === userId) contactIds.add(m.senderId);
    });
    const contacts = await Promise.all(
      Array.from(contactIds).map(id => this.userRepo.findOne({ where: { id } }))
    );
    return contacts.filter(Boolean);
  }
}
