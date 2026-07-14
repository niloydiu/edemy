import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateData: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async delete(id: string) {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { success: true };
  }

  async linkStudent(parentId: string, studentEmail: string) {
    const student = await this.userModel.findOne({ email: studentEmail }).exec();
    if (!student) {
      throw new NotFoundException(`Student with email ${studentEmail} not found`);
    }
    if (student.role !== 'student') {
      throw new BadRequestException(`User ${studentEmail} is not a student`);
    }

    const parent = await this.userModel.findById(parentId).exec();
    if (!parent) {
      throw new NotFoundException(`Parent user not found`);
    }

    // Link student to parent
    if (!parent.studentIds.includes(student._id)) {
      parent.studentIds.push(student._id);
      await parent.save();
    }

    // Link parent to student
    student.parentId = parent._id;
    await student.save();

    return parent;
  }

  async getLinkedStudents(parentId: string) {
    const parent = await this.findOne(parentId);
    return this.userModel.find({ _id: { $in: parent.studentIds } }).exec();
  }
}
