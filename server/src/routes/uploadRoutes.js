import express from 'express'
import { uploadImages, deleteImage } from '../controllers/uploadController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

router.use(protect, adminOnly)

router.post('/', upload.array('images', 6), uploadImages)
router.delete('/', deleteImage)

export default router