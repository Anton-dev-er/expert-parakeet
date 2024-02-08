import {Request, Response} from 'express';
import UserDto from '../dtos/user-dto'

type Role = "Admin" | "User"

interface User {
  role: Role
  email: string,
  id: number
}

interface UserRequest extends Request {
  user?: UserDto | undefined
}


export {Role, User, UserRequest}