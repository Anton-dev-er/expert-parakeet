import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roomController from '../controllers/room.controller';

const router = Router();
router.get('/', roomController.getAll);
router.post('/:userId', authMiddleware, roomController.create);
router.get('/:userId', authMiddleware, roomController.getRooms);
export default router;
