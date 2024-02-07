import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import ApiError from '../errors/api.error'
import { User, UserRequest } from '../types'

export default function(req: UserRequest, res: Response, next: any) {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.headers.authorization?.split(' ')[1] // Bearer token
    if (!token) {
      return next(ApiError.UnauthorizedError())
    }

    req.user = jwt.verify(token, process.env.SECRET_KEY as string) as User
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
};