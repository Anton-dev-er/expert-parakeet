import ApiError from "../errors/ApiError";
import {Request, Response} from 'express';
import {Error} from "../types";

export default function (err: Error, req: Request, res: Response, next: any) {
  console.log("error handling:", Error)
  if (err instanceof ApiError) {
    return res.status(err.status).json({message: err.message})
  }
  return res.status(500).json({message: "Unexpected error"})
}