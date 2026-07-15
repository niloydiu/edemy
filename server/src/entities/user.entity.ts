import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string; // Google User ID

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column({ type: 'varchar', length: 50, default: 'student' })
  role: string; // student | teacher | parent | admin

  @Column({ type: 'varchar', nullable: true })
  parentId: string;

  @Column({ type: 'simple-array', nullable: true, default: '' })
  studentIds: string[];

  @Column({ type: 'simple-array', nullable: true, default: '' })
  enrolledCourses: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
