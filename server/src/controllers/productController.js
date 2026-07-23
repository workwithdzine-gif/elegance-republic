import Product from '../models/Product.js'
import { AppError } from '../middleware/errorHandler.js'
import { slugify } from '../utils/slugify.js'

// @route  GET /api/products  (public)
// Supports: ?category=slug|id  ?gender=Men  ?search=text  ?minPrice=  ?maxPrice=
//           ?sort=price_asc|price_desc|newest|rating  ?page=  ?limit=
export async function getProducts(req, res, next) {
  try {
    const { category, gender, search, minPrice, maxPrice, collection, sort } = req.query
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)

    const filter = { isActive: true }

    if (category) {
      filter.$or = [{ category }, { subcategory: category }]
    }
    if (gender) filter.gender = gender
    if (collection) filter.collectionName = collection
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (search) {
      filter.$text = { $search: search }
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      rating: { rating: -1 },
    }
    const sortBy = sortMap[sort] || { createdAt: -1 }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .sort(sortBy)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products,
    })
  } catch (err) {
    next(err)
  }
}

// @route  GET /api/products/id/:id  (admin only — edit form needs this since the
// public route below looks up by slug, and slugs can change)
export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')
    if (!product) return next(new AppError('Product not found', 404))
    res.status(200).json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

// @route  GET /api/products/:slug  (public)
export async function getProduct(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .populate('subcategory', 'name slug')

    if (!product) return next(new AppError('Product not found', 404))

    res.status(200).json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

// @route  POST /api/products  (admin only)
export async function createProduct(req, res, next) {
  try {
    const slug = slugify(req.body.title)

    const existing = await Product.findOne({ slug })
    if (existing) return next(new AppError('A product with this title already exists', 409))

    const product = await Product.create({
      ...req.body,
      slug,
      createdBy: req.user.id,
    })

    res.status(201).json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

// @route  PUT /api/products/:id  (admin only)
export async function updateProduct(req, res, next) {
  try {
    const updates = { ...req.body }
    if (updates.title) updates.slug = slugify(updates.title)

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!product) return next(new AppError('Product not found', 404))

    res.status(200).json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

// @route  DELETE /api/products/:id  (admin only)
// Soft delete — keeps historical order references intact
export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!product) return next(new AppError('Product not found', 404))

    res.status(200).json({ success: true, message: 'Product deleted' })
  } catch (err) {
    next(err)
  }
}
