import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  senderId: string;

  @Column({ type: 'varchar', length: 255 })
  receiverId: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'int', nullable: true })
  courseId: number; // Optional context

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
