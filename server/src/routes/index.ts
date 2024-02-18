import Router from 'express';
import authRouter from './auth.router';
import roomRouter from './room.router';

const router = Router();
router.use('/auth', authRouter);
router.use('/rooms', roomRouter);

export default router;
