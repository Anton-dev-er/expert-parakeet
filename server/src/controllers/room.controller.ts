import { NextFunction, Request, Response } from 'express';
import roomService from '../services/room.service';
import userService from '../services/user.service';
import userRoomService from '../services/user-room.service';
import RoomDto from '../dtos/room.dto';

class RoomController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomName, roomRoute, isPrivate, isOwner } = req.body;
      const { userId } = req.params;
      const roomEntity = await roomService.create(roomName, roomRoute, isPrivate);
      const userEntity = await userService.getById(userId);
      const userRoomEntity = await userRoomService.create(userEntity, roomEntity, isOwner);

      const roomDto = new RoomDto(userRoomEntity);

      return res.json(roomDto);
    } catch (e) {
      next(e);
    }
  }

  async getRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const userRooms = await userRoomService.getAllUserRoomsByUserId(userId);

      const roomsDto: RoomDto[] = userRooms.map((userRoom) => {
        return new RoomDto(userRoom);
      });

      return res.json(roomsDto);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userRooms = await userRoomService.getAllUserRooms();

      const roomsDto: RoomDto[] = userRooms.map((userRoom) => {
        return new RoomDto(userRoom);
      });

      return res.json(roomsDto);
    } catch (e) {
      next(e);
    }
  }
}

export default new RoomController();
