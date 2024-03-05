import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Column, ManyToOne,
} from 'typeorm';
import RoomEntity from './room.entity';
import UserEntity from './user.entity';

@Entity({ name: 'room_history' })
export default class RoomHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RoomEntity, (room) => room.roomHistory)
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @ManyToOne(() => UserEntity, (user) => user.roomHistory)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ default: 0 })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
