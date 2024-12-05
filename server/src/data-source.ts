import 'reflect-metadata';
import { DataSource } from 'typeorm';
import UserEntity from './entities/user.entity';
import dotenv from 'dotenv';
import RoleEntity from './entities/role.entity';
import UserRoleEntity from './entities/user-role.entity';
import UserLoginEntity from './entities/user-login.entity';
import RoomEntity from './entities/room.entity';
import UserRoomEntity from './entities/user-room.entity';
import UserFriendEntity from './entities/user-friend.entity';
import RoomHistoryEntity from './entities/room-history.entity';

dotenv.config();
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

const connect = async () => {
  // todo check if updatedAt updating
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT || '5432'),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,

    synchronize: true,
    logging: false,
    entities: [UserEntity, RoleEntity, UserRoleEntity, UserLoginEntity, RoomEntity, UserRoomEntity, UserFriendEntity, RoomHistoryEntity],
    migrations: [__dirname + '/migration/*.ts'],
    subscribers: [],
  });

  await AppDataSource.initialize()
  return AppDataSource;
}

export default connect;