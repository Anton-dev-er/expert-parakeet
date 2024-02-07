import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn, OneToMany,
} from 'typeorm'
import UserRolesEntity from './user-roles.entity'

@Entity({ name: "roles" })
export default class RoleEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: false })
    title: string;

    @OneToMany(() => UserRolesEntity, (user) => user.roles)
    userRoles: UserRolesEntity

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}