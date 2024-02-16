import UserEntity from "../entities/user.entity";
import UserLoginEntity from "../entities/user-login.entity";

export default class UserDto {
  id: string;
  email: string;
  name: string;
  isActivated: boolean;

  constructor(user: UserEntity, userLogin: UserLoginEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = userLogin.email;
    this.isActivated = userLogin.isActivated;
  }
}
