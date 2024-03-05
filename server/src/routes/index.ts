import Router from 'express';
import authRouter from './auth.router';
import roomRouter from './room.router';
import userRouter from './user.router';
import friendRouter from './friend.router';
import roomHistoryRouter from './room-history.router';

const router = Router();
router.use('/auth', authRouter);
router.use('/rooms', roomRouter);
router.use('/users', userRouter);
router.use('/friends', friendRouter);
router.use('/rooms-history', roomHistoryRouter);

export default router;
