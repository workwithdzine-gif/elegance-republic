import User from '../models/User.js'
import { AppError } from '../middleware/errorHandler.js'

// @route  GET /api/users  (admin only)
export async function getUsers(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)

    const [users, total] = await Promise.all([
      User.find().select('-password').sort('-createdAt').skip((page - 1) * limit).limit(limit),
      User.countDocuments(),
    ])

    res.status(200).json({ success: true, count: users.length, total, page, users })
  } catch (err) {
    next(err)
  }
}

// @route  PUT /api/users/:id/role  (admin only)  body: { role: 'admin' | 'customer' }
export async function updateUserRole(req, res, next) {
  try {
    const { role } = req.body
    if (!['admin', 'customer'].includes(role)) {
      return next(new AppError('Invalid role', 400))
    }
    if (req.params.id === req.user.id) {
      return next(new AppError('You cannot change your own role', 400))
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password')
    if (!user) return next(new AppError('User not found', 404))

    res.status(200).json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// @route  DELETE /api/users/:id  (admin only)
export async function deleteUser(req, res, next) {
  try {
    if (req.params.id === req.user.id) {
      return next(new AppError('You cannot delete your own account', 400))
    }

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return next(new AppError('User not found', 404))

    res.status(200).json({ success: true, message: 'Customer removed' })
  } catch (err) {
    next(err)
  }
}
