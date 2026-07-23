import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ordersAPI } from '../lib/shopApi'
import { formatPrice } from '../utils/storefront'

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    ordersAPI.all({ page, limit: 20, status: status === 'all' ? undefined : status })
      .then((data) => { setOrders(data.orders); setTotal(data.total) })
      .finally(() => setLoading(false))
  }, [page, status])

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <div className="admin-pills">
        {STATUSES.map((s) => (
          <button key={s} className={`admin-pill${status === s ? ' is-active' : ''}`} onClick={() => { setStatus(s); setPage(1) }}>{s}</button>
        ))}
      </div>

      {loading ? <p className="admin-loading">Loading…</p> : (
        <>
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Payment</th><th>Status</th><th>Total</th><th /></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{order.user?.name || '—'}</td>
                  <td className="admin-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.paymentMethod} · <span className={`admin-badge admin-badge--${order.paymentStatus === 'paid' ? 'active' : 'inactive'}`}>{order.paymentStatus}</span></td>
                  <td><span className={`admin-badge admin-badge--${order.orderStatus}`}>{order.orderStatus}</span></td>
                  <td>{formatPrice(order.totalPrice)}</td>
                  <td><Link className="admin-btn" to={`/admin/orders/${order._id}`}>View</Link></td>
                </tr>
              ))}
              {!orders.length && <tr><td colSpan={7} className="admin-empty-row">No orders found</td></tr>}
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
