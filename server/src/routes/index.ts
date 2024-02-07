import authRouter from "./auth.router";
import Router from "express";

const router = Router()
router.use('/auth', authRouter)

export default router