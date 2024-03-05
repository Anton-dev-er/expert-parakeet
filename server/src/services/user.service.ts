import UserEntity from '../entities/user.entity';
import getAppDataSource from '../data-source';

class UserService {
  async getRepo() {
    const AppDataSource = await getAppDataSource();
    return AppDataSource.getRepository(UserEntity);
  }

  async getAll(): Promise<UserEntity[] | null> {
    const repo = await this.getRepo();
    return await repo.find();
  }

  async create(email: string) {
    const repo = await this.getRepo();
    const userEntity = new UserEntity();
    userEntity.name = email.split('@')[0];
    await repo.save(userEntity);

    return userEntity;
  }

  async getById(id: string): Promise<UserEntity | null> {
    const repo = await this.getRepo();
    return await repo.findOne({ where: { id } });
  }
}

export default new UserService();
