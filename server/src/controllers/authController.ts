import {Role, User, UserRequest} from "../types";
import ApiError from "../errors/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Request, Response} from 'express';

const generateJwt = (id: number, email: string, role: Role) => {
  const user: User = {id, email, role}
  return jwt.sign(
      user,
      process.env.SECRET_KEY as string,
      {expiresIn: '24h'}
  )
}

class UserController {
  async register(req: Request, res: Response, next: (arg: any) => void) {
    const {email, password, role} = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Email or password not correct'))
    }
    console.log("register:", email, password, role)

    return res.json({ok: true})
  }

  async login(req: Request, res: Response, next: (arg: any) => void) {
    const {email, password} = req.body
    console.log("login:", email, password)
    return res.json({ok: true})
  }

  async check(req: UserRequest, res: Response, next: (arg: any) => void) {
    if (req.user) {
      const token = generateJwt(req.user.id, req.user.email, req.user.role)
      return res.json({token, ok: true})
    }
    return res.json({ok: false})
  }
}

export default new UserController()