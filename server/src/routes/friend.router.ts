import { Router } from 'express';
import friendController from '../controllers/friend.controller';

const router = Router();
router.post('/:userId', friendController.create);
router.get('/:userId', friendController.getFriends);
router.get('/:userId/users', friendController.getAvailableUsers);
router.get('/:userId/invites', friendController.getInvites);
router.get('/:friendId/accept', friendController.acceptInvite);
router.get('/:friendId/decline', friendController.declineInvite);

export default router;
