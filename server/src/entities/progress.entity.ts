import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'int' })
  courseId: number;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column({ type: 'simple-array', nullable: true, default: '' })
  completedLessons: string[]; // lesson IDs

  @CreateDateColumn()
  createdAt: Date;
}
