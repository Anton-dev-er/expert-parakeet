import { AppDataSource } from "../data-source";
import RoomEntity from "../entities/room.entity";

class RoomService {
  readonly repo = AppDataSource.getRepository(RoomEntity);

  async create(roomName: string, roomPrivacy: boolean) {
    const roomEntity = new RoomEntity();
    roomEntity.name = roomName;
    roomEntity.is_private = roomPrivacy;
    await this.repo.save(roomEntity);

    return roomEntity;
  }

  async getRoomsByUserId() {}
}

export default new RoomService();
