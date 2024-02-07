import ApiError from '../errors/api.error'
import { Request, Response, NextFunction } from 'express'

export default function(err: ApiError, req: Request, res: Response, next: NextFunction) {
  console.log('error handling middleware:', err)

  // todo, err.status it is bad check
  if (err.status) {
    return res.status(err.status).json({message: err.message, errors: err.errors})
  }
  return res.status(500).json({ message: 'Unexpected error' })
}