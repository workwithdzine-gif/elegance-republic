import Wishlist from '../models/Wishlist.js'
import Product from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'

// @route  GET /api/wishlist  (protected)
export async function getWishlist(req, res, next) {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      'products',
      'title slug images price isActive stockQuantity'
    )

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] })
    }

    res.status(200).json({ success: true, wishlist })
  } catch (err) {
    next(err)
  }
}

// @route  POST /api/wishlist  (protected)
// body: { productId }
export async function addToWishlist(req, res, next) {
  try {
    const { productId } = req.body

    const product = await Product.findOne({ _id: productId, isActive: true })
    if (!product) return next(new AppError('Product not found', 404))

    let wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [] })
    }

    const alreadyIn = wishlist.products.some((p) => p.toString() === productId)
    if (!alreadyIn) {
      wishlist.products.push(productId)
      await wishlist.save()
    }

    await wishlist.populate('products', 'title slug images price isActive stockQuantity')

    res.status(200).json({ success: true, wishlist })
  } catch (err) {
    next(err)
  }
}

// @route  DELETE /api/wishlist/:productId  (protected)
export async function removeFromWishlist(req, res, next) {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id })
    if (!wishlist) return next(new AppError('Wishlist not found', 404))

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    )
    await wishlist.save()
    await wishlist.populate('products', 'title slug images price isActive stockQuantity')

    res.status(200).json({ success: true, wishlist })
  } catch (err) {
    next(err)
  }
}