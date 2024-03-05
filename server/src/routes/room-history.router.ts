import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roomController from '../controllers/room.controller';
import roomHistoryController from '../controllers/room-history.controller';

const router = Router();
router.post('/:userId', roomHistoryController.save);
router.get('/:userId', roomHistoryController.getAll);

export default router;
