import { NextFunction, Request, Response } from "express";
import roomService from "../services/room.service";
import userService from "../services/user.service";
import userRoomService from "../services/user-room.service";
import RoomDto from "../dtos/room-dto";

class RoomController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomName, roomPrivacy } = req.body;
      const { userId } = req.params;
      const roomEntity = await roomService.create(roomName, roomPrivacy);
      const userEntity = await userService.getById(userId);
      const userRoomEntity = await userRoomService.create(
        userEntity,
        roomEntity,
        roomPrivacy,
      );

      const roomDto = new RoomDto(roomEntity, userRoomEntity);

      return res.json({ room: roomDto });
    } catch (e) {
      next(e);
    }
  }

  async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const userRooms = await userRoomService.getUserRooms(userId);

      const roomsDto: RoomDto[] = userRooms.map((userRoom) => {
        return new RoomDto(userRoom.room, userRoom);
      });

      return res.json({ rooms: roomsDto });
    } catch (e) {
      next(e);
    }
  }

  getAll(req: Request, res: Response, next: NextFunction) {}
}

export default new RoomController();
