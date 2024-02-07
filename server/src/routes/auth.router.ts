import { Router } from 'express'
import authController from '../controllers/auth.controller'
import { body } from 'express-validator'

const router = Router()
router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  authController.registration,
)
router.post('/login',
  body('email').notEmpty(),
  body('password').notEmpty(),
  authController.login,
)
// router.post('/logout', authController.logout)
// router.get('/activate/:link', authController.activate)
// router.get('/refresh', authController.refresh)
export default router