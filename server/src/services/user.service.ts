import UserEntity from '../entities/user.entity';
import { AppDataSource } from '../data-source';

class UserService {
  readonly repo = AppDataSource.getRepository(UserEntity);

  async create(email: string, password: string) {
    const userEntity = new UserEntity();
    userEntity.name = email.split('@')[0];
    await this.repo.save(userEntity);

    return userEntity;
  }

  async getById(id: string): Promise<UserEntity | null> {
    return await this.repo.findOne({ where: { id } });
  }
}

export default new UserService();
