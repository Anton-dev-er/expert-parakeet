import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn, ManyToOne,
} from 'typeorm'
import UserEntity from './user.entity'
import RoleEntity from './role.entity'

@Entity({ name: 'userRoles' })
export default class UserRolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  roles: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}