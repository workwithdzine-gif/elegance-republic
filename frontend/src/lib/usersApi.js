import { api } from './api.js'

export const usersAPI = {
  list(params = {}) {
    const query = new URLSearchParams(params).toString()
    return api.get(`/users${query ? `?${query}` : ''}`, { auth: true })
  },
  updateRole(id, role) {
    return api.put(`/users/${id}/role`, { role }, { auth: true }).then((d) => d.user)
  },
  remove(id) {
    return api.del(`/users/${id}`, { auth: true })
  },
}
