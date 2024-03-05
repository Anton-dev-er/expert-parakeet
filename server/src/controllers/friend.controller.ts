import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/api.error';
import UserFriendService from '../services/user-friend.service';
import FriendDto from '../dtos/friend.dto';
import UserLoginService from '../services/user-login.service';
import UserDto from '../dtos/user.dto';
import userService from '../services/user.service';
import userFriendService from '../services/user-friend.service';
import UserEntity from '../entities/user.entity';

class FriendController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { friendId } = req.body;
      const { userId } = req.params;
      if (!friendId || !userId) {
        return next(ApiError.BadRequest('FriendId can be null'));
      }

      const userFriendEntity = await UserFriendService.create(userId, friendId);
      const receiverLogin = await UserLoginService.getByUserId(friendId);
      const friendDto = new FriendDto(userFriendEntity, receiverLogin);

      return res.json(friendDto);
    } catch (e) {
      next(e);
    }
  }

  async getFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const friendsDto: FriendDto[] = [];

      const friends = await UserFriendService.getAcceptedUserFriends(userId);

      for (const friend of friends) {
        // todo, dont do getByUser for every friend
        // todo refactor
        if (friend.userReceiver.id === userId) {
          const receiverLogin = await UserLoginService.getByUserId(friend.userSender.id);
          const friendDto = new FriendDto(friend, receiverLogin, true);
          friendsDto.push(friendDto);
        } else if (friend.userSender.id === userId) {
          const receiverLogin = await UserLoginService.getByUserId(friend.userReceiver.id);
          const friendDto = new FriendDto(friend, receiverLogin);
          friendsDto.push(friendDto);
        }
      }

      return res.json(friendsDto);
    } catch (e) {
      next(e);
    }
  }

  async getAvailableUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const usersDto: UserDto[] = [];

      const users = await userService.getAll();
      const friends = await userFriendService.getAllUserFriends(userId);

      const availableUsers: UserEntity[] = users.filter((user) => {
        if (userId === user.id) {
          return false;
        }

        const isFriend = friends.some(
          (friend) => friend.userReceiver.id === user.id || friend.userSender.id === user.id
        );
        return !isFriend;
      });

      for (const user of availableUsers) {
        // todo, dont do getByUser for every user
        const userLogin = await UserLoginService.getByUserId(user.id);
        const userDto = new UserDto(user, userLogin);
        usersDto.push(userDto);
      }

      return res.json(usersDto);
    } catch (e) {
      next(e);
    }
  }

  async getInvites(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const friendsDto: FriendDto[] = [];

      const friends = await UserFriendService.getReceiversByUserId(userId);

      for (const friend of friends) {
        if (!friend.isAccepted && !friend.isDeclined) {
          // todo, dont do getByUser for every friend
          const receiverLogin = await UserLoginService.getByUserId(friend.userSender.id);
          const friendDto = new FriendDto(friend, receiverLogin, true);
          friendsDto.push(friendDto);
        }
      }

      return res.json(friendsDto);
    } catch (e) {
      next(e);
    }
  }

  async acceptInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const { friendId } = req.params;

      const userFriendEntity = await UserFriendService.getById(friendId);
      userFriendEntity.isAccepted = true;
      await UserFriendService.update(userFriendEntity);

      return res.json({ message: 'ok' });
    } catch (e) {
      next(e);
    }
  }

  async declineInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const { friendId } = req.params;

      const userFriendEntity = await UserFriendService.getById(friendId);
      userFriendEntity.isDeclined = true;
      await UserFriendService.update(userFriendEntity);

      return res.json({ message: 'ok' });
    } catch (e) {
      next(e);
    }
  }
}

export default new FriendController();
