import {Request, Response} from 'express';

type Role = "Admin" | "User"

interface User {
  role: Role
  email: string,
  id: number
}

interface UserRequest extends Request {
  user?: User | undefined
}

interface Error {
  status: number,
  message: string
}


export {Error, Role, User, UserRequest}