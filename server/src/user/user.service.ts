import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async update(id: string, updateData: Partial<User>) {
    await this.userRepo.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: string) {
    const user = await this.findOne(id);
    await this.userRepo.delete(id);
    return { success: true };
  }

  async linkStudent(parentId: string, studentEmail: string) {
    const student = await this.userRepo.findOne({ where: { email: studentEmail } });
    if (!student) throw new NotFoundException(`Student ${studentEmail} not found`);
    if (student.role !== 'student') throw new BadRequestException(`${studentEmail} is not a student`);

    const parent = await this.findOne(parentId);
    const currentStudentIds = parent.studentIds || [];
    if (!currentStudentIds.includes(student.id)) {
      parent.studentIds = [...currentStudentIds, student.id];
      await this.userRepo.save(parent);
    }

    student.parentId = parentId;
    await this.userRepo.save(student);
    return parent;
  }

  async getLinkedStudents(parentId: string) {
    const parent = await this.findOne(parentId);
    if (!parent.studentIds || parent.studentIds.length === 0) return [];
    const students = await Promise.all(
      parent.studentIds.map(id => this.userRepo.findOne({ where: { id } }))
    );
    return students.filter(Boolean);
  }
}
