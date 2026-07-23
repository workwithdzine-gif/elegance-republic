import express from 'express'
import {
  createOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updateOrderFulfillment,
  deleteOrder,
} from '../controllers/orderController.js'
import { protect, adminOnly } from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(protect) // every order route requires login

router.post('/', createOrder)
router.get('/my', getMyOrders)
router.get('/', adminOnly, getAllOrders)
router.get('/:id', getOrder)
router.put('/:id/cancel', cancelOrder)
router.put('/:id/status', adminOnly, updateOrderStatus)
router.put('/:id/fulfillment', adminOnly, updateOrderFulfillment)
router.delete('/:id', adminOnly, deleteOrder)

export default router
