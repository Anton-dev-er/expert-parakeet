import "reflect-metadata"
import { DataSource } from "typeorm"
import UserEntity from "./entities/user.entity"
import dotenv from "dotenv";
import RoleEntity from './entities/role.entity'
import UserRolesEntity from './entities/user-roles.entity'
import UserLoginEntity from './entities/user-login.entity'

dotenv.config();
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, ENV } = process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,

    synchronize: true,
    logging: false,
    entities: [UserEntity, RoleEntity, UserRolesEntity, UserLoginEntity],
    migrations: [__dirname + "/migration/*.ts"],
    subscribers: [],
});
