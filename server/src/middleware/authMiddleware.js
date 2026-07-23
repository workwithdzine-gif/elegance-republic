import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AppError } from './errorHandler.js'
import { env } from '../config/env.js'

export async function protect(req, res, next) {
  try {
    let token

    if (req.cookies?.token && req.cookies.token !== 'none') {
      token = req.cookies.token
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return next(new AppError('Not authorized, please log in', 401))
    }

    const decoded = jwt.verify(token, env.jwtSecret)

    const user = await User.findById(decoded.id)
    if (!user) {
      return next(new AppError('User belonging to this token no longer exists', 401))
    }

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin access required', 403))
  }
  next()
}