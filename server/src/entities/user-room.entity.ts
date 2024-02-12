import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Column,
} from "typeorm";
import UserEntity from "./user.entity";
import RoomEntity from "./room.entity";

@Entity({ name: "user_room" })
export default class UserRoomEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.userRooms)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @OneToOne(() => RoomEntity)
  @JoinColumn({ name: "room_id" })
  room: RoomEntity;

  @Column({ default: false })
  is_owner: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
