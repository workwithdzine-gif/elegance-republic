import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { categoriesAPI } from '../lib/catalogApi'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null = closed, {} = new, {...} = editing existing

  const load = () => categoriesAPI.list(false).then(setCategories).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const remove = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? This can't be undone.`)) return
    await categoriesAPI.remove(category._id)
    load()
  }

  const byId = Object.fromEntries(categories.map((c) => [c._id, c]))

  return (
    <div>
      <div className="admin-page-head">
        <h1 className="admin-page-title">Categories</h1>
        <button className="admin-btn admin-btn--primary" onClick={() => setEditing({})}><Plus size={16} /> New category</button>
      </div>

      {loading ? <p className="admin-loading">Loading…</p> : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Slug</th><th>Parent</th><th /></tr></thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td className="admin-muted">{category.slug}</td>
                <td className="admin-muted">{category.parent ? byId[category.parent]?.name || '—' : '—'}</td>
                <td className="admin-row-actions">
                  <button className="admin-icon-btn" onClick={() => setEditing(category)}><Pencil size={15} /></button>
                  <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => remove(category)}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {!categories.length && <tr><td colSpan={4} className="admin-empty-row">No categories yet</td></tr>}
          </tbody>
        </table>
      )}

      {editing && (
        <CategoryModal
          category={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load() }}
        />
      )}
    </div>
  )
}

function CategoryModal({ category, categories, onClose, onSaved }) {
  const isNew = !category._id
  const [form, setForm] = useState({
    name: category.name || '',
    description: category.description || '',
    parent: category.parent || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, parent: form.parent || null }
      if (isNew) await categoriesAPI.create(payload)
      else await categoriesAPI.update(category._id, payload)
      onSaved()
    } catch (err) {
      setError(err.message || 'Could not save category')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <header><h2>{isNew ? 'New category' : 'Edit category'}</h2><button type="button" className="admin-icon-btn" onClick={onClose}><X size={18} /></button></header>
        <label className="er-field"><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label className="er-field"><span>Description</span><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label className="er-field"><span>Parent category</span>
          <select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}>
            <option value="">None (top-level)</option>
            {categories.filter((c) => c._id !== category._id).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </label>
        {error && <p className="er-form-error">{error}</p>}
        <button className="admin-btn admin-btn--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save category'}</button>
      </form>
    </div>
  )
}
