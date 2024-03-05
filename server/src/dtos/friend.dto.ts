import UserFriendEntity from '../entities/user-friend.entity';
import UserDto from './user.dto';
import UserLoginEntity from '../entities/user-login.entity';

export default class FriendDto {
  id: string;
  user: UserDto;
  isAccepted: boolean;
  isDeclined: boolean;

  constructor(friend: UserFriendEntity, receiverLogin: UserLoginEntity, userSender?: boolean) {
    this.id = friend.id;
    this.isAccepted = friend.isAccepted;
    this.isDeclined = friend.isDeclined;
    if (userSender) {
      this.user = new UserDto(friend.userSender, receiverLogin);
    } else {
      this.user = new UserDto(friend.userReceiver, receiverLogin);
    }
  }
}
