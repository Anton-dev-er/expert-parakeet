import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import RoomHistoryEntity from './room-history.entity';

@Entity({ name: 'room' })
export default class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  route: string;

  @Column({ name: 'is_private', default: false })
  isPrivate: boolean;

  @OneToMany(() => RoomHistoryEntity, (roomHistory) => roomHistory.user)
  roomHistory: RoomHistoryEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
