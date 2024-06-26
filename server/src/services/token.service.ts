import UserDto from '../dtos/user.dto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userLoginService from './user-login.service';
import { JwtAccessTokenPayload } from '../types';

class TokenService {
  generateTokens(payload: UserDto) {
    const accessToken = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  encryptPassword(password: string) {
    return bcrypt.hashSync(password, 12);
  }

  comparePassword(hashPassword: string, password: string) {
    if (!hashPassword || !password) {
      return false;
    }
    return bcrypt.compareSync(password, hashPassword);
  }

  validateAccessToken(token: string): UserDto {
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as JwtAccessTokenPayload;
      return payload.payload;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): null | { payload: UserDto } {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as {
        payload: UserDto;
      };
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId: string, refreshToken: string) {
    const userLoginRepo = await userLoginService.getRepo();
    const userLogin = await userLoginRepo.findOne({
      where: { user: { id: userId } },
    });
    userLogin.refreshToken = refreshToken;
    await userLoginRepo.save(userLogin);
  }

  async removeToken(userId: string) {
    const userLoginRepo = await userLoginService.getRepo();
    const userLogin = await userLoginRepo.findOne({
      where: { user: { id: userId } },
    });
    userLogin.refreshToken = null;
    await userLoginRepo.save(userLogin);
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

export default new TokenService();
