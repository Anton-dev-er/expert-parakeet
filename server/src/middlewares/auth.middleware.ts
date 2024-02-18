import { NextFunction, Response } from 'express';
import ApiError from '../errors/api.error';
import { UserRequest } from '../types';
import tokenService from '../services/token.service';

export default function(req: UserRequest, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const authorizationHeader = req.headers.authorization;

    const token = authorizationHeader?.split(' ')[1]; // Bearer token
    if (!token) {
      return next(ApiError.UnauthorizedError('Unauthorized error, token not valid'));
    }

    const user = tokenService.validateAccessToken(token);
    if (!user) {
      return next(ApiError.UnauthorizedError('Unauthorized error, verify error'));
    }

    req.user = user;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError('Not Authorized'));
  }
}
