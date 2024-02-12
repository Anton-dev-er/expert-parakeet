import { AppDataSource } from "../data-source";
import UserRoomEntity from "../entities/user-room.entity";
import UserEntity from "../entities/user.entity";
import RoomEntity from "../entities/room.entity";

class UserRoomService {
  readonly repo = AppDataSource.getRepository(UserRoomEntity);

  async create(user: UserEntity, room: RoomEntity, isOwner: boolean) {
    const userRoomEntity = new UserRoomEntity();
    userRoomEntity.user = user;
    userRoomEntity.room = room;
    userRoomEntity.is_owner = isOwner;
    await this.repo.save(userRoomEntity);

    return userRoomEntity;
  }

  async getUserRooms(userId: string): Promise<UserRoomEntity[]> {
    const userRooms = await this.repo.find({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    return userRooms;
  }
}

export default new UserRoomService();
