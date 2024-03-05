import userService from '../services/user.service';
import UserDto from '../dtos/user.dto';
import userLoginService from '../services/user-login.service';
import roomService from '../services/room.service';
import userRoomService from '../services/user-room.service';
import RoomDto from '../dtos/room.dto';
import { NextFunction, Request, Response } from 'express';

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const usersDtos = [];
      const usersLogin = await userLoginService.getAll();

      usersLogin.forEach((userLogin) => {
        const userDto = new UserDto(userLogin.user, userLogin);
        usersDtos.push(userDto);
      });

      return res.json(usersDtos);
    } catch (e) {
      next(e);
    }
    return;
  }

}

export default new UserController();
