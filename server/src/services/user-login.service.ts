import getAppDataSource from '../data-source';
import UserLoginEntity from '../entities/user-login.entity';
import tokenService from './token.service';
import UserEntity from '../entities/user.entity';

class UserLoginService {
  async getRepo() {
    const AppDataSource = await getAppDataSource();
    return AppDataSource.getRepository(UserLoginEntity);
  }

  async getAll(): Promise<UserLoginEntity[] | null> {
    const repo = await this.getRepo();
    return await repo.find({
      relations: { user: true },
    });
  }

  async getByUser(user: UserEntity): Promise<UserLoginEntity | null> {
    const repo = await this.getRepo();
    return await repo.findOne({
      where: { user },
    });
  }

  async getByUserId(userId: string): Promise<UserLoginEntity | null> {
    const repo = await this.getRepo();
    return await repo.findOne({
      where: { user: { id: userId } },
    });
  }

  async create(email: string, password: string, user: UserEntity) {
    const repo = await this.getRepo();

    const userLoginEntity = new UserLoginEntity();
    const hashPassword = tokenService.encryptPassword(password);
    // const activationLink = uuid.v4() // v34fa-asfasf-142saf-sa-asf

    // todo sending activation link on email
    userLoginEntity.activationLink = 'no link';
    userLoginEntity.isActivated = true;
    userLoginEntity.email = email;
    userLoginEntity.password = hashPassword;
    userLoginEntity.user = user;
    await repo.save(userLoginEntity);

    return userLoginEntity;
  }
}

export default new UserLoginService();
