import express from 'express'
import rateLimit from 'express-rate-limit'
import { register, login, getMe, logout } from '../controllers/authController.js'
import { registerValidation, loginValidation } from '../middleware/validators.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
})

router.post('/register', registerValidation, register)
router.post('/login', loginLimiter, loginValidation, login)
router.get('/me', protect, getMe)
router.post('/logout', logout)

export default router