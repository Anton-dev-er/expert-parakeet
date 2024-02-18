import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { body } from 'express-validator';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();
router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  authController.registration,
);
router.post('/login', body('email').notEmpty(), body('password').notEmpty(), authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.get('/health', authMiddleware, authController.health);
// router.get('/activate/:link', authController.activate)
export default router;
