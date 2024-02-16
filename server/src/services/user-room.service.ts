import { AppDataSource } from "../data-source";
import UserRoomEntity from "../entities/user-room.entity";
import UserEntity from "../entities/user.entity";
import RoomEntity from "../entities/room.entity";

class UserRoomService {
  readonly repo = AppDataSource.getRepository(UserRoomEntity);

  async create(user: UserEntity, room: RoomEntity, isOwner: boolean) {
    const userRoom = await this.getUserRoomByRoomIdAndUserId(room.id, user.id);
    if (userRoom) {
      console.log("userRoom already exists:", room.name, user.name);
      return userRoom;
    }

    const userRoomEntity = new UserRoomEntity();
    userRoomEntity.user = user;
    userRoomEntity.room = room;
    userRoomEntity.is_owner = isOwner;
    await this.repo.save(userRoomEntity);

    return userRoomEntity;
  }

  async getUserRoomByRoomIdAndUserId(roomId: string, userId: string) {
    return this.repo.findOneBy({ room: { id: roomId }, user: { id: userId } });
  }

  async getAllUserRoomsByUserId(userId: string) {
    return await this.repo.find({
      where: { user: { id: userId } },
      relations: { room: true, user: true },
    });
  }

  async getUserRoomByUserRoomId(userRoomId: string) {
    return await this.repo.findOne({
      where: { id: userRoomId },
      relations: { room: true, user: true },
    });
  }

  async getAllUserRooms() {
    // only public
    return await this.repo.find({
      where: { room: { is_private: false } },
      relations: { room: true, user: true },
    });
  }
}

export default new UserRoomService();
