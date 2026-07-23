import { body, validationResult } from 'express-validator'
import { AppError } from './errorHandler.js'

export function checkValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(', ')
    return next(new AppError(message, 400))
  }
  next()
}

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  checkValidation,
]

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  checkValidation,
]