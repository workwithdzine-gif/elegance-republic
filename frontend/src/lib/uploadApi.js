import { api } from './api.js'

export const uploadAPI = {
  async images(files) {
    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('images', file))
    const data = await api.upload('/upload', formData)
    return data.urls // array of Cloudinary URLs
  },
  remove(url) {
    return api.del('/upload', { auth: true, body: { url } })
  },
}
