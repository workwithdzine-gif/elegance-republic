import { api } from './api.js'

export const productsAPI = {
  // params: { category, gender, search, minPrice, maxPrice, collection, sort, page, limit }
  async list(params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
    ).toString()
    const data = await api.get(`/products${query ? `?${query}` : ''}`)
    return data // { products, total, page, totalPages }
  },

  async get(slug) {
    const data = await api.get(`/products/${slug}`)
    return data.product
  },

  async getById(id) {
    const data = await api.get(`/products/id/${id}`, { auth: true })
    return data.product
  },

  create(payload) {
    return api.post('/products', payload, { auth: true }).then((d) => d.product)
  },

  update(id, payload) {
    return api.put(`/products/${id}`, payload, { auth: true }).then((d) => d.product)
  },

  remove(id) {
    return api.del(`/products/${id}`, { auth: true })
  },
}

export const categoriesAPI = {
  async list(tree = false) {
    const data = await api.get(`/categories${tree ? '?tree=true' : ''}`)
    return data.categories
  },

  async get(slug) {
    const data = await api.get(`/categories/${slug}`)
    return data.category
  },

  create(payload) {
    return api.post('/categories', payload, { auth: true }).then((d) => d.category)
  },

  update(id, payload) {
    return api.put(`/categories/${id}`, payload, { auth: true }).then((d) => d.category)
  },

  remove(id) {
    return api.del(`/categories/${id}`, { auth: true })
  },
}
