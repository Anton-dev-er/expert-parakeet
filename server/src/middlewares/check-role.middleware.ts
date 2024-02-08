import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';
import {Role, User} from "../types";
import ApiError from "../errors/api.error";


export default function (role: Role) {
  return function (req: Request, res: Response, next: (error?: any) => any) {
    if (req.method === "OPTIONS") {
      next()
    }
    try {
      const token = req.headers.authorization?.split(' ')[1] // Bearer token
      if (!token) {
        return next(ApiError.UnauthorizedError())
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as User
      if (decoded.role !== role) {
        return next(ApiError.forbidden())
      }
      req.user = decoded;
      next()
    } catch (e) {
      return next(ApiError.UnauthorizedError())
    }
  };
}