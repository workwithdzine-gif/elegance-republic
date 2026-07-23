import multer from 'multer'
import { AppError } from './errorHandler.js'

const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError('Only JPG, PNG, and WEBP images are allowed', 400), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
})