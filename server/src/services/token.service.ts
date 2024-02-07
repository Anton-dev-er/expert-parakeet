import UserDto from '../dtos/user-dto'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import userLoginService from './user-login.service'
import userService from './user.service'

class TokenService {
  generateTokens(payload: UserDto) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    return {
      accessToken,
      refreshToken,
    }
  }

  encryptPassword(password: string) {
    return bcrypt.hashSync(password, 12)
  }

  comparePassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword)
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    } catch (e) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (e) {
      return null
    }
  }

  async saveToken(userId: string, refreshToken: string) {
    const userLoginRepo = userLoginService.repo
    const userRepo = userService.repo

    const user = await userRepo.findOne({ where: { id: userId } })
    const userLogin = await userLoginRepo.findOne({ where: { user: user } })

    userLogin.refreshToken = refreshToken
    await userLoginRepo.save(userLogin)
  }

  // async removeToken(refreshToken) {
  //   const tokenData = await tokenModel.deleteOne({ refreshToken })
  //   return tokenData
  // }
  //
  // async findToken(refreshToken) {
  //   const tokenData = await tokenModel.findOne({ refreshToken })
  //   return tokenData
  // }
}

export default new TokenService()