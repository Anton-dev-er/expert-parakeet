import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import UserRoomEntity from './user-room.entity';
import UserFriendEntity from './user-friend.entity';
import RoomHistoryEntity from './room-history.entity';

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

  @OneToMany(() => UserRoomEntity, (userRoom) => userRoom.user)
  userRooms: UserRoomEntity[];

  @OneToMany(() => UserFriendEntity, (user) => user.userSender)
  userSenders: UserFriendEntity[];

  @OneToMany(() => UserFriendEntity, (user) => user.userReceiver)
  userReceivers: UserFriendEntity[];

  @OneToMany(() => RoomHistoryEntity, (roomHistory) => roomHistory.user)
  roomHistory: RoomHistoryEntity[];
}
