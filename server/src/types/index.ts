import { Request } from 'express';
import UserDto from '../dtos/user.dto';
import { JwtPayload } from 'jsonwebtoken';

type Role = 'Admin' | 'User';

interface User {
  role: Role;
  email: string;
  id: number;
}

interface JwtAccessTokenPayload extends JwtPayload {
  payload: UserDto;
}

interface UserRequest extends Request {
  user?: UserDto | undefined;
}

export { Role, User, UserRequest, JwtAccessTokenPayload };
