import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import UserEntity from './user.entity';

@Entity({ name: 'user_friend' })
export default class UserFriendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.userSenders)
  @JoinColumn({ name: 'user_sender' })
  userSender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.userReceivers)
  @JoinColumn({ name: 'user_receiver' })
  userReceiver: UserEntity;

  @Column({ name: 'is_accepted', default: false })
  isAccepted: boolean;

  @Column({ name: 'is_declined', default: false })
  isDeclined: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
