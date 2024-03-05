import getAppDataSource from '../data-source';
import UserFriendEntity from '../entities/user-friend.entity';
import UserService from './user.service';

// todo refactor all
class UserFriendService {
  async getRepo() {
    const AppDataSource = await getAppDataSource();
    return AppDataSource.getRepository(UserFriendEntity);
  }

  async create(userId: string, friendId: string): Promise<UserFriendEntity> {
    const repo = await this.getRepo();
    const existed = await repo.findOne({
      where: { userSender: { id: userId }, userReceiver: { id: friendId } },
      relations: { userSender: true, userReceiver: true },
    });
    if (existed) {
      console.log('This user already did invite to that friend');
      return existed;
    }
    const userFriendEntity = new UserFriendEntity();

    const sender = await UserService.getById(userId);
    const receiver = await UserService.getById(friendId);

    userFriendEntity.userSender = sender;
    userFriendEntity.userReceiver = receiver;

    await repo.save(userFriendEntity);

    return userFriendEntity;
  }

  async update(userFriendEntity: UserFriendEntity) {
    const repo = await this.getRepo();
    await repo.save(userFriendEntity);
  }

  async getById(friendId: string): Promise<UserFriendEntity | null> {
    const repo = await this.getRepo();
    return repo.findOne({ where: { id: friendId } });
  }

  async getAcceptedUserFriends(userId: string) {
    const repo = await this.getRepo();
    return await repo.find({
      where: [
        { userSender: { id: userId }, isAccepted: true },
        { userReceiver: { id: userId }, isAccepted: true },
      ],
      relations: { userReceiver: true, userSender: true },
    });
  }

  async getSendersByUserId(userId: string) {
    const repo = await this.getRepo();
    return await repo.find({
      where: { userSender: { id: userId } },
      relations: { userSender: true, userReceiver: true },
    });
  }

  async getReceiversByUserId(userId: string) {
    const repo = await this.getRepo();
    return await repo.find({
      where: { userReceiver: { id: userId } },
      relations: { userSender: true, userReceiver: true },
    });
  }

  async getAllUserFriends(userId: string) {
    const repo = await this.getRepo();
    return await repo.find({
      where: [{ userReceiver: { id: userId } }, { userSender: { id: userId } }],
      relations: { userSender: true, userReceiver: true },
    });
  }
}

export default new UserFriendService();
