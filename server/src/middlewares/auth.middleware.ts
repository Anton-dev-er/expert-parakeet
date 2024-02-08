import jwt from 'jsonwebtoken'
import { Response } from 'express'
import ApiError from '../errors/api.error'
import { UserRequest } from '../types'
import UserDto from '../dtos/user-dto'

export default function(req: UserRequest, res: Response, next: any) {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.headers.authorization?.split(' ')[1] // Bearer token
    if (!token) {
      return next(ApiError.UnauthorizedError("Unauthorized error, token not valid"))
    }

    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as UserDto
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
};