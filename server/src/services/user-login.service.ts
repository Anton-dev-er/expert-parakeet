import bcrypt from 'bcrypt'
import uuid from 'uuid'
import { AppDataSource } from '../data-source'
import UserLoginEntity from '../entities/user-login.entity'
import tokenService from './token.service'


class UserLoginService {
  readonly repo = AppDataSource.getRepository(UserLoginEntity)

  create = async (email: string, password: string) => {
    const userLoginEntity = new UserLoginEntity()
    const hashPassword = tokenService.encryptPassword(password);
    const activationLink = uuid.v4() // v34fa-asfasf-142saf-sa-asf

    // todo sending activation link on email
    userLoginEntity.isActivated = true
    userLoginEntity.email = email
    userLoginEntity.password = hashPassword
    userLoginEntity.activationLink = activationLink
    await this.repo.save(userLoginEntity)

    return { userLoginEntity }
  }
}

export default new UserLoginService()