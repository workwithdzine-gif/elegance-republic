import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'

export async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      'title slug images price isActive stockQuantity'
    )

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] })
    }

    res.status(200).json({ success: true, cart })
  } catch (err) {
    next(err)
  }
}

export async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1, size = null, color = null } = req.body

    const product = await Product.findOne({ _id: productId, isActive: true })
    if (!product) return next(new AppError('Product not found', 404))

    if (product.stockQuantity < quantity) {
      return next(new AppError('Not enough stock available', 400))
    }

    let cart = await Cart.findOne({ user: req.user.id })
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] })
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId && item.size === size && item.color === color
    )

    if (existingItem) {
      existingItem.quantity += Number(quantity)
    } else {
      cart.items.push({ product: productId, quantity, size, color, priceAtAdd: product.price })
    }

    await cart.save()
    await cart.populate('items.product', 'title slug images price isActive stockQuantity')

    res.status(200).json({ success: true, cart })
  } catch (err) {
    next(err)
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { quantity } = req.body
    if (!quantity || quantity < 1) {
      return next(new AppError('Quantity must be at least 1', 400))
    }

    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return next(new AppError('Cart not found', 404))

    const item = cart.items.id(req.params.itemId)
    if (!item) return next(new AppError('Cart item not found', 404))

    item.quantity = quantity
    await cart.save()
    await cart.populate('items.product', 'title slug images price isActive stockQuantity')

    res.status(200).json({ success: true, cart })
  } catch (err) {
    next(err)
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return next(new AppError('Cart not found', 404))

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId)
    await cart.save()
    await cart.populate('items.product', 'title slug images price isActive stockQuantity')

    res.status(200).json({ success: true, cart })
  } catch (err) {
    next(err)
  }
}

export async function clearCart(req, res, next) {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [] },
      { new: true, upsert: true }
    )
    res.status(200).json({ success: true, cart })
  } catch (err) {
    next(err)
  }
}