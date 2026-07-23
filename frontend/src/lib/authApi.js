import { api, setToken } from './api.js'

export const authAPI = {
  async register({ name, email, password }) {
    const data = await api.post('/auth/register', { name, email, password })
    setToken(data.token)
    return data.user
  },

  async login({ email, password }) {
    const data = await api.post('/auth/login', { email, password })
    setToken(data.token)
    return data.user
  },

  async logout() {
    await api.post('/auth/logout', {}, { auth: true }).catch(() => {})
    setToken(null)
  },

  async me() {
    const data = await api.get('/auth/me', { auth: true })
    return data.user
  },
}