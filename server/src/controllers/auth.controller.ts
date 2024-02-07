import ApiError from '../errors/api.error'
import { validationResult } from 'express-validator'
import { Request, Response } from 'express'
import authService from '../services/auth.service'


class AuthController {
  async registration(req: Request, res: Response, next: any) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation Error', errors.array()))
      }
      const { email, password } = req.body
      const { user, accessToken, refreshToken } = await authService.registration(email, password)
      await authService.saveRefreshToken(res, user.id, refreshToken)

      return res.json({ user, accessToken, refreshToken })
    } catch (e) {
      next(e)
    }
  }

  async login(req: Request, res: Response, next: any) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation Error', errors.array()))
      }

      const { email, password } = req.body
      const { user, accessToken, refreshToken } = await authService.login(email, password)
      await authService.saveRefreshToken(res, user.id, refreshToken)

      return res.json({ user, accessToken, refreshToken })
    } catch (e) {
      next(e)
    }
  }
}

export default new AuthController()