import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async sendMessage(senderId: string, receiverId: string, messageText: string, courseId?: string) {
    const msg = new this.messageModel({
      senderId,
      receiverId,
      message: messageText,
      courseId,
    });
    return msg.save();
  }

  async getChatHistory(userId1: string, userId2: string) {
    return this.messageModel.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ createdAt: 1 }).exec();
  }

  // Get active contacts for a user
  async getContacts(userId: string) {
    // Find all messages involving this user
    const messages = await this.messageModel.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).exec();

    const contactIds = new Set<string>();
    messages.forEach((m) => {
      if (m.senderId !== userId) contactIds.add(m.senderId);
      if (m.receiverId !== userId) contactIds.add(m.receiverId);
    });

    return this.userModel.find({ _id: { $in: Array.from(contactIds) } }).exec();
  }
}
