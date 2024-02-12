import ApiError from "../errors/api.error";
import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";
import tokenService from "../services/token.service";

class AuthController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()));
      }
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } =
        await authService.registration(email, password);
      await authService.saveRefreshToken(res, user.id, refreshToken);

      return res.json({ user, accessToken, refreshToken });
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation Error", errors.array()));
      }

      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login(
        email,
        password,
      );
      await authService.saveRefreshToken(res, user.id, refreshToken);

      return res.json({ user, accessToken, refreshToken });
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const user = await authService.removeRefreshToken(res, refreshToken);
      return res.json({ user, accessToken: null, refreshToken: null });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const { userDto } = await authService.refresh(refreshToken);
      const tokens = tokenService.generateTokens(userDto);
      await authService.saveRefreshToken(res, userDto.id, refreshToken);
      return res.json({ ...tokens, user: userDto });
    } catch (e) {
      next(e);
    }
  }

  health(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthController();
