import { Trash2, UploadCloud, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { categoriesAPI, productsAPI } from '../lib/catalogApi'
import { uploadAPI } from '../lib/uploadApi'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const GENDER_OPTIONS = ['Men', 'Women', 'Unisex', 'Kids']

const emptyForm = {
  title: '', description: '', category: '', subcategory: '', gender: 'Men',
  price: '', comparePrice: '', colors: '', sizes: [], tags: '',
  collectionName: '', season: '', stockQuantity: '', badge: '', images: [], isActive: true,
}

export default function AdminProductForm() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    categoriesAPI.list(false).then(setCategories)
  }, [])

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    productsAPI.getById(id).then((product) => {
      if (!product || cancelled) return
      setForm({
        title: product.title, description: product.description || '',
        category: product.category?._id || '', subcategory: product.subcategory?._id || '',
        gender: product.gender, price: product.price, comparePrice: product.comparePrice || '',
        colors: (product.colors || []).join(', '), sizes: product.sizes || [],
        tags: (product.tags || []).join(', '), collectionName: product.collectionName || '',
        season: product.season || '', stockQuantity: product.stockQuantity,
        badge: product.badge || '', images: product.images || [], isActive: product.isActive,
      })
    }).catch((err) => setError(err.message || 'Could not load product')).finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id, isNew])

  const toggleSize = (size) => {
    setForm((f) => ({ ...f, sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size] }))
  }

  const handleUpload = async (event) => {
    const files = event.target.files
    if (!files?.length) return
    setUploading(true)
    try {
      const urls = await uploadAPI.images(files)
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
    } catch (err) {
      setError(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const removeImage = (url) => setForm((f) => ({ ...f, images: f.images.filter((img) => img !== url) }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        subcategory: form.subcategory || null,
        gender: form.gender,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        colors: form.colors.split(',').map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes,
        tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
        collectionName: form.collectionName,
        season: form.season,
        stockQuantity: Number(form.stockQuantity) || 0,
        badge: form.badge,
        images: form.images,
        isActive: form.isActive,
      }
      if (isNew) await productsAPI.create(payload)
      else await productsAPI.update(id, payload)
      navigate('/admin/products')
    } catch (err) {
      setError(err.message || 'Could not save product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="admin-loading">Loading…</p>

  return (
    <div className="admin-form-page">
      <h1 className="admin-page-title">{isNew ? 'New product' : 'Edit product'}</h1>
      <form className="admin-form-grid" onSubmit={submit}>
        <div className="admin-form-main">
          <section className="admin-panel">
            <label className="er-field"><span>Title</span><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
            <label className="er-field"><span>Description</span><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <div className="admin-field-row">
              <label className="er-field"><span>Category</span>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </label>
              <label className="er-field"><span>Subcategory (optional)</span>
                <select value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })}>
                  <option value="">None</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="admin-panel">
            <h2>Images</h2>
            <div className="admin-image-grid">
              {form.images.map((url) => (
                <div className="admin-image-tile" key={url}>
                  <img src={url} alt="" />
                  <button type="button" onClick={() => removeImage(url)}><Trash2 size={14} /></button>
                </div>
              ))}
              <label className="admin-image-upload">
                <UploadCloud size={20} />
                <span>{uploading ? 'Uploading…' : 'Upload'}</span>
                <input type="file" accept="image/*" multiple hidden onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </section>

          <section className="admin-panel">
            <h2>Variants</h2>
            <div className="admin-size-picker">
              {SIZE_OPTIONS.map((size) => (
                <button type="button" key={size} className={`admin-size-chip${form.sizes.includes(size) ? ' is-active' : ''}`} onClick={() => toggleSize(size)}>{size}</button>
              ))}
            </div>
            <label className="er-field"><span>Colors (comma separated)</span><input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder="cream, black, navy" /></label>
            <label className="er-field"><span>Tags (comma separated)</span><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Eastern Wear, Premium" /></label>
          </section>
        </div>

        <div className="admin-form-side">
          <section className="admin-panel">
            <h2>Pricing & stock</h2>
            <label className="er-field"><span>Price (PKR)</span><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" /></label>
            <label className="er-field"><span>Compare-at price (optional)</span><input type="number" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} min="0" /></label>
            <label className="er-field"><span>Stock quantity</span><input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required min="0" /></label>
          </section>

          <section className="admin-panel">
            <h2>Organization</h2>
            <label className="er-field"><span>Gender</span>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label className="er-field"><span>Collection</span><input value={form.collectionName} onChange={(e) => setForm({ ...form, collectionName: e.target.value })} placeholder="Best Sellers" /></label>
            <label className="er-field"><span>Season</span><input value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} placeholder="Summer" /></label>
            <label className="er-field"><span>Badge</span><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Best Seller" /></label>
            <label className="admin-checkbox-field"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /><span>Visible on storefront</span></label>
          </section>

          {error && <p className="er-form-error">{error}</p>}
          <button className="admin-btn admin-btn--primary admin-btn--block" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
        </div>
      </form>
    </div>
  )
}
