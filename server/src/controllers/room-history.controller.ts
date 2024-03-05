import { NextFunction, Request, Response } from 'express';
import UserRoomService from '../services/user-room.service';
import RoomHistoryService from '../services/room-history.service';
import roomHistoryService from '../services/room-history.service';
import userService from '../services/user.service';

class RoomHistoryController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const roomDto: string[] = [];

      const roomHistories = await roomHistoryService.getHistoryByUserId(userId);

      roomHistories.forEach((roomHistory) => {
        roomDto.push(roomHistory.room.name);
      });

      return res.json(roomDto);
    } catch (e) {
      next(e);
    }
  }

  async save(req: Request, res: Response, next: NextFunction) {
    // todo, refactor
    try {
      const { userId } = req.params;
      const { userRoomId } = req.body;

      const userRoom = await UserRoomService.getUserRoomByUserRoomId(userRoomId);

      const roomHistoryEntity = await RoomHistoryService.getByRoomIdAndUserId(
        userId,
        userRoom.room.id
      );

      if (roomHistoryEntity) {
        roomHistoryEntity.count = roomHistoryEntity.count + 1;
        await RoomHistoryService.update(roomHistoryEntity);
      } else {
        const user = await userService.getById(userId);
        await RoomHistoryService.create(user, userRoom.room);
      }

      return res.json({ message: 'ok' });
    } catch (e) {
      next(e);
    }
  }
}

export default new RoomHistoryController();
