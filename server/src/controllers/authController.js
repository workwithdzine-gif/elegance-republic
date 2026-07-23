import User from '../models/User.js'
import { AppError } from '../middleware/errorHandler.js'
import { sendTokenResponse } from '../utils/generateToken.js'

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new AppError('An account with this email already exists', 409))
    }

    const user = await User.create({ name, email, password, authProvider: 'local' })

    sendTokenResponse(user, 201, res)
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid email or password', 401))
    }

    sendTokenResponse(user, 200, res)
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return next(new AppError('User not found', 404))

    res.status(200).json({ success: true, user: user.toSafeObject() })
  } catch (err) {
    next(err)
  }
}

export function logout(req, res) {
  res.cookie('token', 'none', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(200).json({ success: true, message: 'Logged out' })
}