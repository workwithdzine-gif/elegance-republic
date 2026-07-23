import cloudinary from '../config/cloudinary.js'
import { AppError } from '../middleware/errorHandler.js'

function streamUpload(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'z-elegance/products' },
      (error, result) => {
        if (result) resolve(result)
        else reject(error)
      }
    )
    stream.end(buffer)
  })
}

export async function uploadImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new AppError('No images provided', 400))
    }

    const uploadPromises = req.files.map((file) => streamUpload(file.buffer))
    const results = await Promise.all(uploadPromises)

    const urls = results.map((r) => r.secure_url)

    res.status(200).json({ success: true, urls })
  } catch (err) {
    next(err)
  }
}

export async function deleteImage(req, res, next) {
  try {
    const { url } = req.body
    if (!url) return next(new AppError('Image URL is required', 400))

    const parts = url.split('/')
    const fileName = parts[parts.length - 1].split('.')[0]
    const publicId = `z-elegance/products/${fileName}`

    await cloudinary.uploader.destroy(publicId)

    res.status(200).json({ success: true, message: 'Image deleted' })
  } catch (err) {
    next(err)
  }
}