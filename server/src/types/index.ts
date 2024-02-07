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


export {Role, User, UserRequest}