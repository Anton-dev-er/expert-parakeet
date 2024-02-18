import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import UserRoomEntity from './user-room.entity';

@Entity({ name: 'user' })
export default class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRoomEntity, (photo) => photo.user)
  userRooms: UserRoomEntity[];
}
