import getAppDataSource from '../data-source';
import RoomEntity from '../entities/room.entity';

class RoomService {
  async getRepo() {
    const AppDataSource = await getAppDataSource();
    return AppDataSource.getRepository(RoomEntity);
  }

  async create(roomName: string, roomRoute: string, isPrivate: boolean): Promise<RoomEntity> {
    const repo = await this.getRepo();

    const roomEntity = new RoomEntity();
    roomEntity.name = roomName;
    roomEntity.route = roomRoute;
    roomEntity.isPrivate = isPrivate;
    await repo.save(roomEntity);

    return roomEntity;
  }

  async getById(id: string): Promise<RoomEntity | null> {
    const repo = await this.getRepo();
    return await repo.findOne({ where: { id } });
  }
}

export default new RoomService();
