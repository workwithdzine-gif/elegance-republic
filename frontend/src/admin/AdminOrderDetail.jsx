import { ArrowLeft, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ordersAPI } from '../lib/shopApi'
import { formatPrice } from '../utils/storefront'

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [fulfillment, setFulfillment] = useState({ trackingNumber: '', carrier: '', adminNotes: '' })
  const [updating, setUpdating] = useState(false)
  const [savingFulfillment, setSavingFulfillment] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = () => ordersAPI.get(id).then((data) => {
    setOrder(data)
    setFulfillment({ trackingNumber: data.trackingNumber || '', carrier: data.carrier || '', adminNotes: data.adminNotes || '' })
  }).finally(() => setLoading(false))
  useEffect(() => { load() }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const changeStatus = async (nextStatus) => {
    setUpdating(true)
    try {
      const updated = await ordersAPI.updateStatus(id, nextStatus)
      setOrder(updated)
    } finally {
      setUpdating(false)
    }
  }

  const saveFulfillment = async (event) => {
    event.preventDefault()
    setSavingFulfillment(true)
    try {
      const updated = await ordersAPI.updateFulfillment(id, fulfillment)
      setOrder(updated)
    } finally {
      setSavingFulfillment(false)
    }
  }

  const removeOrder = async () => {
    if (!window.confirm('Permanently delete this order? This cannot be undone.')) return
    await ordersAPI.remove(id)
    navigate('/admin/orders')
  }

  if (loading) return <p className="admin-loading">Loading…</p>
  if (!order) return <p className="admin-loading">Order not found</p>

  return (
    <div className="admin-form-page">
      <Link to="/admin/orders" className="admin-back-link"><ArrowLeft size={16} /> Back to orders</Link>
      <div className="admin-page-head">
        <h1 className="admin-page-title">{order.orderNumber}</h1>
        <div className="admin-row-actions">
          <select value={order.orderStatus} disabled={updating} onChange={(e) => changeStatus(e.target.value)} className="admin-status-select">
            {STATUS_FLOW.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="admin-icon-btn admin-icon-btn--danger" title="Delete order" onClick={removeOrder}><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="admin-form-grid">
        <div className="admin-form-main">
          <section className="admin-panel">
            <h2>Items</h2>
            <table className="admin-table">
              <thead><tr><th>Item</th><th>Size</th><th>Qty</th><th>Price</th></tr></thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.size || '—'}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="admin-panel">
            <h2>Fulfillment</h2>
            <form onSubmit={saveFulfillment} className="admin-field-row">
              <label className="er-field"><span>Tracking number</span><input value={fulfillment.trackingNumber} onChange={(e) => setFulfillment({ ...fulfillment, trackingNumber: e.target.value })} placeholder="e.g. TCS123456789" /></label>
              <label className="er-field"><span>Carrier</span><input value={fulfillment.carrier} onChange={(e) => setFulfillment({ ...fulfillment, carrier: e.target.value })} placeholder="e.g. TCS, Leopards" /></label>
              <label className="er-field er-field--wide"><span>Internal notes (not shown to customer)</span><textarea rows={3} value={fulfillment.adminNotes} onChange={(e) => setFulfillment({ ...fulfillment, adminNotes: e.target.value })} /></label>
              <button className="admin-btn admin-btn--primary" type="submit" disabled={savingFulfillment}>{savingFulfillment ? 'Saving…' : 'Save fulfillment details'}</button>
            </form>
          </section>
        </div>

        <div className="admin-form-side">
          <section className="admin-panel">
            <h2>Customer</h2>
            <p>{order.user?.name}</p>
            <p className="admin-muted">{order.user?.email}</p>
          </section>
          <section className="admin-panel">
            <h2>Shipping address</h2>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
          </section>
          <section className="admin-panel">
            <h2>Summary</h2>
            <div className="admin-summary-line"><span>Items</span><span>{formatPrice(order.itemsPrice)}</span></div>
            <div className="admin-summary-line"><span>Shipping</span><span>{order.shippingPrice ? formatPrice(order.shippingPrice) : 'Free'}</span></div>
            <div className="admin-summary-line admin-summary-line--total"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
            <p className="admin-muted">{order.paymentMethod} · {order.paymentStatus}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
