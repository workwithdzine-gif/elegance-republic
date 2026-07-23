import { api } from './api.js'

export const cartAPI = {
  get() {
    return api.get('/cart', { auth: true }).then((d) => d.cart)
  },
  add({ productId, quantity, size, color }) {
    return api.post('/cart', { productId, quantity, size, color }, { auth: true }).then((d) => d.cart)
  },
  updateQuantity(itemId, quantity) {
    return api.put(`/cart/${itemId}`, { quantity }, { auth: true }).then((d) => d.cart)
  },
  remove(itemId) {
    return api.del(`/cart/${itemId}`, { auth: true }).then((d) => d.cart)
  },
  clear() {
    return api.del('/cart', { auth: true }).then((d) => d.cart)
  },
}

export const wishlistAPI = {
  get() {
    return api.get('/wishlist', { auth: true }).then((d) => d.wishlist)
  },
  add(productId) {
    return api.post('/wishlist', { productId }, { auth: true }).then((d) => d.wishlist)
  },
  remove(productId) {
    return api.del(`/wishlist/${productId}`, { auth: true }).then((d) => d.wishlist)
  },
}

export const ordersAPI = {
  create({ shippingAddress, notes }) {
    return api.post('/orders', { shippingAddress, notes }, { auth: true }).then((d) => d.order)
  },
  myOrders() {
    return api.get('/orders/my', { auth: true }).then((d) => d.orders)
  },
  get(id) {
    return api.get(`/orders/${id}`, { auth: true }).then((d) => d.order)
  },
  cancel(id) {
    return api.put(`/orders/${id}/cancel`, {}, { auth: true }).then((d) => d.order)
  },
  // admin
  all(params = {}) {
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    const query = new URLSearchParams(clean).toString()
    return api.get(`/orders${query ? `?${query}` : ''}`, { auth: true })
  },
  updateStatus(id, orderStatus) {
    return api.put(`/orders/${id}/status`, { orderStatus }, { auth: true }).then((d) => d.order)
  },
  updateFulfillment(id, { trackingNumber, carrier, adminNotes }) {
    return api.put(`/orders/${id}/fulfillment`, { trackingNumber, carrier, adminNotes }, { auth: true }).then((d) => d.order)
  },
  remove(id) {
    return api.del(`/orders/${id}`, { auth: true })
  },
}
