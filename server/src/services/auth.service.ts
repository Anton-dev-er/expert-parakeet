import userService from './user.service';
import { Response } from 'express';
import tokenService from './token.service';
import ApiError from '../errors/api.error';
import userLoginService from './user-login.service';
import UserDto from '../dtos/user.dto';

// todo good to refactor, some methods to emphasize in user service
class AuthService {
  MAX_TOKEN_LIFE = 30 * 24 * 60 * 60 * 1000;

  async saveRefreshToken(res: Response, userId: string, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      maxAge: this.MAX_TOKEN_LIFE,
      httpOnly: true,
    });
    await tokenService.saveToken(userId, refreshToken);
  }

  async removeRefreshToken(res: Response, refreshToken: string) {
    res.clearCookie('refreshToken');
    const { payload } = tokenService.validateRefreshToken(refreshToken);
    await tokenService.removeToken(payload.id);
    return payload;
  }

  async registration(email: string, password: string) {
    const userLoginRepo = await userLoginService.getRepo();
    const user = await userLoginRepo.findOne({ where: { email } });
    if (user) {
      throw ApiError.BadRequest(`${email} already exists`);
    }

    const userEntity = await userService.create(email);
    const userLoginEntity = await userLoginService.create(email, password, userEntity);

    const userDto = new UserDto(userEntity, userLoginEntity);
    const { accessToken, refreshToken } = tokenService.generateTokens(userDto);

    return { accessToken, refreshToken, user: userDto };
  }

  async login(email: string, password: string) {
    const userLoginRepo = await userLoginService.getRepo();
    const userRepo = await userService.getRepo();

    const userLogin = await userLoginRepo.findOne({
      where: { email },
      relations: { user: true },
    });
    const isPassEquals = tokenService.comparePassword(userLogin?.password, password);
    if (!userLogin || !userLogin.user || !isPassEquals) {
      throw ApiError.BadRequest('Wrong email or password');
    }

    const user = await userRepo.findOne({ where: { id: userLogin.user.id } });
    const userDto = new UserDto(user, userLogin);
    const { accessToken, refreshToken } = tokenService.generateTokens(userDto);

    return { accessToken, refreshToken, user: userDto };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.forbidden();
    }
    const userLoginRepo = await userLoginService.getRepo();
    const userRepo = await userService.getRepo();

    const userData = tokenService.validateRefreshToken(refreshToken);
    const userLogin = await userLoginRepo.findOne({ where: { refreshToken } });
    if (!userData || !userLogin) {
      throw ApiError.forbidden();
    }

    const user = await userRepo.findOneBy({ id: userData.payload.id });
    const userDto = new UserDto(user, userLogin);

    return { userDto };
  }
}

export default new AuthService();
