import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm'
import UserEntity from './user.entity'

@Entity({ name: "userLogin" })
export default class UserLoginEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => UserEntity, { cascade: true })
    @JoinColumn()
    user: UserEntity

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    isActivated: boolean;

    @Column({ nullable: false })
    activationLink: string;

    @Column({ default: null })
    refreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}