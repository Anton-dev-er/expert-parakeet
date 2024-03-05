import getAppDataSource from '../data-source';
import RoomEntity from '../entities/room.entity';
import RoomHistoryEntity from '../entities/room-history.entity';
import UserEntity from '../entities/user.entity';

class RoomHistoryService {
  async getRepo() {
    const AppDataSource = await getAppDataSource();
    return AppDataSource.getRepository(RoomHistoryEntity);
  }

  async create(user: UserEntity, room: RoomEntity): Promise<RoomHistoryEntity> {
    const repo = await this.getRepo();

    const roomHistoryEntity = new RoomHistoryEntity();
    roomHistoryEntity.room = room;
    roomHistoryEntity.user = user;
    roomHistoryEntity.count = 0;

    await repo.save(roomHistoryEntity);
    return roomHistoryEntity;
  }

  async getByRoomIdAndUserId(userId: string, roomId: string): Promise<RoomHistoryEntity> {
    const repo = await this.getRepo();

    return await repo.findOne({
      where: {
        room: { id: roomId },
        user: { id: userId },
      },
    });
  }

  async getHistoryByUserId(userId: string): Promise<RoomHistoryEntity[]> {
    const repo = await this.getRepo();

    return await repo.find({
      where: { user: { id: userId } },
      relations: { user: true, room: true },
    });
  }

  async update(roomHistoryEntity: RoomHistoryEntity) {
    const repo = await this.getRepo();
    await repo.save(roomHistoryEntity);
  }
}

export default new RoomHistoryService();
