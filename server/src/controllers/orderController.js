import mongoose from 'mongoose'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'
import { generateOrderNumber } from '../utils/generateOrderNumber.js'

const FREE_SHIPPING_THRESHOLD = 5000
const FLAT_SHIPPING_RATE = 200

// @route  POST /api/orders  (protected)
// body: { shippingAddress: {...}, paymentMethod }
export async function createOrder(req, res, next) {
  const session = await mongoose.startSession()
  try {
    const { shippingAddress, paymentMethod = 'COD' } = req.body

    if (!shippingAddress) {
      return next(new AppError('Shipping address is required', 400))
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product')
    if (!cart || cart.items.length === 0) {
      return next(new AppError('Your cart is empty', 400))
    }

    let order
    await session.withTransaction(async () => {
      // Re-check stock at the moment of ordering — it may have changed since it was added to cart
      for (const item of cart.items) {
        const product = item.product
        if (!product || !product.isActive) {
          throw new AppError(`"${item.product?.title || 'A product'}" is no longer available`, 400)
        }
        if (product.stockQuantity < item.quantity) {
          throw new AppError(`Not enough stock for "${product.title}"`, 400)
        }
      }

      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        title: item.product.title,
        image: item.product.images?.[0] || '',
        price: item.priceAtAdd,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      }))

      const itemsPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
      const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE
      const totalPrice = itemsPrice + shippingPrice

      const created = await Order.create(
        [
          {
            user: req.user.id,
            orderNumber: generateOrderNumber(),
            items: orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
          },
        ],
        { session }
      )
      order = created[0]

      // Decrement stock for each purchased item
      for (const item of cart.items) {
        await Product.updateOne(
          { _id: item.product._id },
          { $inc: { stockQuantity: -item.quantity } },
          { session }
        )
      }

      // Empty the cart now that it's been converted into an order
      cart.items = []
      await cart.save({ session })
    })

    res.status(201).json({ success: true, order })
  } catch (err) {
    next(err)
  } finally {
    session.endSession()
  }
}

// @route  GET /api/orders/my  (protected) — logged-in user's own orders
export async function getMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt')
    res.status(200).json({ success: true, count: orders.length, orders })
  } catch (err) {
    next(err)
  }
}

// @route  GET /api/orders/:id  (protected) — owner or admin only
export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) return next(new AppError('Order not found', 404))

    const isOwner = order.user._id.toString() === req.user.id
    if (!isOwner && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to view this order', 403))
    }

    res.status(200).json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

// @route  PUT /api/orders/:id/cancel  (protected) — owner only, and only while still pending
export async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return next(new AppError('Order not found', 404))

    if (order.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to cancel this order', 403))
    }
    if (order.orderStatus !== 'pending') {
      return next(new AppError('Only pending orders can be cancelled', 400))
    }

    order.orderStatus = 'cancelled'
    order.cancelledAt = new Date()
    await order.save()

    // Restock the cancelled items
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stockQuantity: item.quantity } })
    }

    res.status(200).json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

// @route  GET /api/orders  (admin only) — all orders, optional ?status= filter
export async function getAllOrders(req, res, next) {
  try {
    const filter = {}
    if (req.query.status) filter.orderStatus = req.query.status

    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      orders,
    })
  } catch (err) {
    next(err)
  }
}

// @route  PUT /api/orders/:id/fulfillment  (admin only)
// body: { trackingNumber, carrier, adminNotes }
export async function updateOrderFulfillment(req, res, next) {
  try {
    const { trackingNumber, carrier, adminNotes } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { trackingNumber, carrier, adminNotes },
      { new: true }
    )
    if (!order) return next(new AppError('Order not found', 404))
    res.status(200).json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

// @route  DELETE /api/orders/:id  (admin only) — permanently removes an order
// (for cleaning up test/duplicate orders; real customer orders should normally
// be cancelled via status instead of deleted)
export async function deleteOrder(req, res, next) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) return next(new AppError('Order not found', 404))
    res.status(200).json({ success: true, message: 'Order deleted' })
  } catch (err) {
    next(err)
  }
}
// body: { orderStatus } — e.g. 'processing', 'shipped', 'delivered'
export async function updateOrderStatus(req, res, next) {
  try {
    const { orderStatus } = req.body
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(orderStatus)) {
      return next(new AppError('Invalid order status', 400))
    }

    const order = await Order.findById(req.params.id)
    if (!order) return next(new AppError('Order not found', 404))

    order.orderStatus = orderStatus
    if (orderStatus === 'delivered') order.deliveredAt = new Date()

    await order.save()

    res.status(200).json({ success: true, order })
  } catch (err) {
    next(err)
  }
}
