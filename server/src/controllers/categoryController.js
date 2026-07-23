import Category from '../models/Category.js'
import { AppError } from '../middleware/errorHandler.js'
import { slugify } from '../utils/slugify.js'

export async function getCategories(req, res, next) {
  try {
    const categories = await Category.find({ isActive: true }).sort('name').lean()

    if (req.query.tree === 'true') {
      const byId = {}
      categories.forEach((c) => (byId[c._id] = { ...c, children: [] }))
      const tree = []
      categories.forEach((c) => {
        if (c.parent && byId[c.parent]) {
          byId[c.parent].children.push(byId[c._id])
        } else {
          tree.push(byId[c._id])
        }
      })
      return res.status(200).json({ success: true, count: tree.length, categories: tree })
    }

    res.status(200).json({ success: true, count: categories.length, categories })
  } catch (err) {
    next(err)
  }
}

export async function getCategory(req, res, next) {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    if (!category) return next(new AppError('Category not found', 404))
    res.status(200).json({ success: true, category })
  } catch (err) {
    next(err)
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, description, image, parent } = req.body
    const slug = slugify(name)

    const existing = await Category.findOne({ slug })
    if (existing) return next(new AppError('A category with this name already exists', 409))

    const category = await Category.create({ name, slug, description, image, parent: parent || null })
    res.status(201).json({ success: true, category })
  } catch (err) {
    next(err)
  }
}

export async function updateCategory(req, res, next) {
  try {
    const updates = { ...req.body }
    if (updates.name) updates.slug = slugify(updates.name)

    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!category) return next(new AppError('Category not found', 404))

    res.status(200).json({ success: true, category })
  } catch (err) {
    next(err)
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!category) return next(new AppError('Category not found', 404))

    res.status(200).json({ success: true, message: 'Category deleted' })
  } catch (err) {
    next(err)
  }
}