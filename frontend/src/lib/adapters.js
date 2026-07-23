// Transforms API responses (Mongo-shaped: _id, populated refs, etc.) into the
// flat shape the existing UI components were built against (id, categorySlug,
// subcategorySlug, collection, sold, ...) — so components like ProductCard,
// ProductGrid, and the filter/sort helpers in utils/storefront.js need no changes.

export function adaptProduct(p) {
  if (!p) return null
  return {
    id: p._id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    category: p.category?.name || '',
    categorySlug: p.category?.slug || '',
    subcategory: p.subcategory?.name || '',
    subcategorySlug: p.subcategory?.slug || '',
    collection: p.collectionName || '',
    season: p.season || '',
    gender: p.gender,
    price: p.price,
    comparePrice: p.comparePrice,
    images: p.images || [],
    color: p.colors?.[0] || '',
    sizes: p.sizes || [],
    tags: p.tags || [],
    inStock: p.inStock,
    stockQuantity: p.stockQuantity,
    rating: p.rating || 0,
    sold: p.numReviews || 0,
    badge: p.badge || '',
  }
}

export function adaptCategory(c) {
  if (!c) return null
  return {
    id: c._id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    parent: c.parent || null,
    children: (c.children || []).map(adaptCategory),
  }
}

// Flattens a backend cart (items: [{ product: {...}, quantity, size, _id }])
// into the shape CartDrawer/Cart.jsx already expect (id, title, images,
// cartKey, selectedSize, quantity, price frozen at add-time).
export function adaptCart(cart) {
  if (!cart?.items) return []
  return cart.items
    .filter((item) => item.product) // product may be null if it was deleted after being added
    .map((item) => ({
      ...adaptProduct(item.product),
      cartKey: item._id,
      selectedSize: item.size,
      quantity: item.quantity,
      price: item.priceAtAdd,
    }))
}
