import { AppDataSource } from '../data-source';
import RoomEntity from '../entities/room.entity';

class RoomService {
  readonly repo = AppDataSource.getRepository(RoomEntity);

  async create(roomName: string, roomRoute: string, isPrivate: boolean): Promise<RoomEntity> {
    const roomEntity = new RoomEntity();
    roomEntity.name = roomName;
    roomEntity.route = roomRoute;
    roomEntity.is_private = isPrivate;
    await this.repo.save(roomEntity);

    return roomEntity;
  }
}

export default new RoomService();
