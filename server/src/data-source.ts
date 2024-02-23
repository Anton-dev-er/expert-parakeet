import 'reflect-metadata';
import { DataSource } from 'typeorm';
import UserEntity from './entities/user.entity';
import dotenv from 'dotenv';
import RoleEntity from './entities/role.entity';
import UserRoleEntity from './entities/user-role.entity';
import UserLoginEntity from './entities/user-login.entity';
import RoomEntity from './entities/room.entity';
import UserRoomEntity from './entities/user-room.entity';
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';

dotenv.config();
const { TYPEORM_HOST, TYPEORM_USERNAME, TYPEORM_PASSWORD } = process.env;

let dataSource = null;
const connect = async () => {
  // to not initialize it every time, cause google sql cloud kinda slow
  if (dataSource) {
    return dataSource;
  }
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: TYPEORM_HOST,
    authType: 'IAM' as AuthTypes,
    ipType: 'PUBLIC' as IpAddressTypes,
  });

  // todo check if updatedAt updating
  dataSource = new DataSource({
    type: 'postgres',
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    extra: clientOpts,
    synchronize: true,
    logging: true,
    entities: [UserEntity, RoleEntity, UserRoleEntity, UserLoginEntity, RoomEntity, UserRoomEntity],
    migrations: [__dirname + '/migration/*.ts'],
    subscribers: [],
  });

  await dataSource.initialize();

  return dataSource;
};

export default connect;
