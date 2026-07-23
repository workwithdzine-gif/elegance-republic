import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function generateToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}

export function sendTokenResponse(user, statusCode, res) {
  const token = generateToken(user._id)

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }

  res.cookie('token', token, cookieOptions)

  res.status(statusCode).json({
    success: true,
    token,
    user: user.toSafeObject(),
  })
}