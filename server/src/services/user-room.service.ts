import getAppDataSource from '../data-source';
import UserRoomEntity from '../entities/user-room.entity';
import UserEntity from '../entities/user.entity';
import RoomEntity from '../entities/room.entity';

class UserRoomService {
  async getRepo() {
    const AppDataSource = await getAppDataSource();
    return AppDataSource.getRepository(UserRoomEntity);
  }

  async create(user: UserEntity, room: RoomEntity, isOwner: boolean) {
    const repo = await this.getRepo();

    const userRoom = await this.getUserRoomByRoomIdAndUserId(room.id, user.id);
    if (userRoom) {
      console.log('userRoom already exists:', room.name, user.name);
      return userRoom;
    }

    const userRoomEntity = new UserRoomEntity();
    userRoomEntity.user = user;
    userRoomEntity.room = room;
    userRoomEntity.is_owner = isOwner;
    await repo.save(userRoomEntity);

    return userRoomEntity;
  }

  async getUserRoomByRoomIdAndUserId(roomId: string, userId: string) {
    const repo = await this.getRepo();

    return repo.findOneBy({ room: { id: roomId }, user: { id: userId } });
  }

  async getAllUserRoomsByUserId(userId: string) {
    const repo = await this.getRepo();

    return await repo.find({
      where: { user: { id: userId } },
      relations: { room: true, user: true },
    });
  }

  async getUserRoomByUserRoomId(userRoomId: string): Promise<UserRoomEntity> {
    const repo = await this.getRepo();

    try {
      return await repo.findOne({
        where: { id: userRoomId },
        relations: { room: true, user: true },
      });
    } catch (e) {
      console.error('error:', e);
      return null;
    }
  }

  async getAllUserRooms() {
    const repo = await this.getRepo();

    // only public
    return await repo.find({
      where: { room: { is_private: false } },
      relations: { room: true, user: true },
    });
  }
}

export default new UserRoomService();
