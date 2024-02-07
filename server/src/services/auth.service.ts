import userService from './user.service'
import { Response } from 'express'
import tokenService from './token.service'
import ApiError from '../errors/api.error'
import userLoginService from './user-login.service'
import UserDto from '../dtos/user-dto'

class AuthService {
  MAX_TOKEN_LIFE = 30 * 24 * 60 * 60 * 1000

  async saveRefreshToken(res: Response, userId: string, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, { maxAge: this.MAX_TOKEN_LIFE, httpOnly: true })
    await tokenService.saveToken(userId, refreshToken)
  }

  async registration(email: string, password: string) {
    const userLoginRepo = userLoginService.repo
    const user = await userLoginRepo.findOne({ where: { email } })
    if (user) {
      throw ApiError.BadRequest(`${email} already exists`)
    }

    const { userEntity } = await userService.create(email, password)
    const { userLoginEntity } = await userLoginService.create(email, password)

    const userDto = new UserDto(userEntity, userLoginEntity)
    const { accessToken, refreshToken } = tokenService.generateTokens(userDto)

    return { accessToken, refreshToken, user: userDto }
  }

  async login(email: string, password: string) {
    const userLoginRepo = userLoginService.repo
    const userRepo = userService.repo

    const userLogin = await userLoginRepo.findOne({ where: { email } })
    const user = await userRepo.findOne({ where: { id: userLogin.user.id } })

    const isPassEquals = tokenService.comparePassword(userLogin.password, password)
    if (!userLogin || !isPassEquals) {
      throw ApiError.BadRequest('Wrong email or password')
    }

    const userDto = new UserDto(user, userLogin)
    const { accessToken, refreshToken } = tokenService.generateTokens(userDto)

    return { accessToken, refreshToken, user: userDto }
  }
}

export default new AuthService()