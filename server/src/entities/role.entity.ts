import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import UserRoleEntity from './user-role.entity';

@Entity({ name: 'role' })
export default class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
