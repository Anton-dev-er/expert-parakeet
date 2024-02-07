import UserEntity from '../entities/user.entity'
import { AppDataSource } from '../data-source'



class UserService {
  readonly repo = AppDataSource.getRepository(UserEntity)
  create = async (email: string, password: string) => {
    const userEntity = new UserEntity()
    userEntity.name = email.split('@')[0]
    await this.repo.save(userEntity)

    return { userEntity }
  }
}

export default new UserService()