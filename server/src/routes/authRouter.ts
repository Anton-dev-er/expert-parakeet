import { Router } from 'express';

import authMiddleware from "../middleware/authMiddleware";
import authController from "../controllers/authController";

const router = Router();
router.post('/reg', authController.register)
router.post('/login', authController.login)
router.get('/auth', authMiddleware, authController.check)
export default router