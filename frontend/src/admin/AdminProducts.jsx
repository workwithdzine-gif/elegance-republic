import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '../lib/catalogApi'
import { formatPrice } from '../utils/storefront'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    productsAPI.list({ page, limit: 20, search: search || undefined })
      .then((data) => { setProducts(data.products); setTotal(data.total) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  const submitSearch = (event) => { event.preventDefault(); setPage(1); load() }

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.title}"? This can't be undone.`)) return
    await productsAPI.remove(product._id)
    load()
  }

  return (
    <div>
      <div className="admin-page-head">
        <h1 className="admin-page-title">Products</h1>
        <Link className="admin-btn admin-btn--primary" to="/admin/products/new"><Plus size={16} /> New product</Link>
      </div>

      <form className="admin-search" onSubmit={submitSearch}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" />
        <button className="admin-btn" type="submit">Search</button>
      </form>

      {loading ? <p className="admin-loading">Loading…</p> : (
        <>
          <table className="admin-table">
            <thead><tr><th /><th>Title</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td><div className="admin-thumb">{product.images?.[0] ? <img src={product.images[0]} alt="" /> : <span>No image</span>}</div></td>
                  <td>{product.title}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td className={product.stockQuantity === 0 ? 'admin-danger-text' : ''}>{product.stockQuantity}</td>
                  <td><span className={`admin-badge ${product.isActive ? 'admin-badge--active' : 'admin-badge--inactive'}`}>{product.isActive ? 'Active' : 'Hidden'}</span></td>
                  <td className="admin-row-actions">
                    <Link className="admin-icon-btn" to={`/admin/products/${product._id}`}><Pencil size={15} /></Link>
                    <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => remove(product)}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={6} className="admin-empty-row">No products found</td></tr>}
            </tbody>
          </table>
          <div className="admin-pagination">
            <button className="admin-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span>Page {page} of {Math.max(1, Math.ceil(total / 20))}</span>
            <button className="admin-btn" disabled={page * 20 >= total} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  )
}
