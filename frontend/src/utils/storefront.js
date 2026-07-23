import { productPhotos } from '../data/photos.js'

export const formatPrice = (value) => `PKR.${Number(value || 0).toLocaleString('en-PK')}`

export const discountPercent = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

const stablePhotoNumber = (value) => {
  let hash = 0
  for (const char of String(value)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return String((hash % 30) + 1).padStart(3, '0')
}

export function productImage(product, index = 0) {
  // Real images uploaded via the admin panel (Cloudinary URLs) take priority
  if (product?.images?.[index]) return product.images[index]
  if (product?.images?.[0] && index > 0) return product.images[0] // reuse main shot for hover state if only one exists

  const override = productPhotos[product?.id]?.[index] || product?.photos?.[index]
  if (override) return override
  const photoId = /^ew-\d{3}$/.test(product?.id || '')
    ? product.id
    : `ew-${stablePhotoNumber(product?.id || product?.title || 'product')}`
  return `/images/products/${photoId}${index ? `-${index + 1}` : ''}.jpg`
}

export const imageFallback = (event) => {
  event.currentTarget.onerror = null
  event.currentTarget.src = '/images/placeholder.jpg'
}

export const collectionNameFromSlug = (slug) => ({
  'new-arrivals': 'New Arrivals',
  'best-sellers': 'Best Sellers',
  'summer-edit': 'Summer Edit',
  'premium-line': 'Premium Line',
  sale: 'Sale',
}[slug] || null)

export const matchesSearch = (product, query) => {
  const needle = String(query || '').trim().toLowerCase()
  if (!needle) return true
  return [
    product.title,
    product.category,
    product.subcategory,
    product.collection,
    product.gender,
    ...(product.tags || []),
  ].some((value) => String(value || '').toLowerCase().includes(needle))
}

export const sortProducts = (items, sort) => {
  const list = [...items]
  if (sort === 'low') return list.sort((a, b) => a.price - b.price)
  if (sort === 'high') return list.sort((a, b) => b.price - a.price)
  if (sort === 'best') return list.sort((a, b) => b.sold - a.sold)
  if (sort === 'rating') return list.sort((a, b) => b.rating - a.rating)
  if (sort === 'newest') return list.sort((a, b) => String(b.id).localeCompare(String(a.id)))
  return list
}

export const classNames = (...values) => values.filter(Boolean).join(' ')

