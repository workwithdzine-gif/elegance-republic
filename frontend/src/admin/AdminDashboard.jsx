import { useEffect, useState } from 'react'
import { Package, ShoppingBag, Tags, Wallet } from 'lucide-react'
import { productsAPI, categoriesAPI } from '../lib/catalogApi'
import { ordersAPI } from '../lib/shopApi'
import { formatPrice } from '../utils/storefront'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      productsAPI.list({ limit: 1 }),
      categoriesAPI.list(),
      ordersAPI.all({ limit: 100 }),
    ]).then(([productsRes, categories, ordersRes]) => {
      if (cancelled) return
      const revenue = ordersRes.orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' || o.orderStatus !== 'cancelled' ? o.totalPrice : 0), 0)
      setStats({
        productCount: productsRes.total,
        categoryCount: categories.length,
        orderCount: ordersRes.total,
        revenue,
      })
      setRecentOrders(ordersRes.orders.slice(0, 6))
    }).finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [])

  if (loading) return <p className="admin-loading">Loading dashboard…</p>

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-stat-grid">
        <StatCard icon={ShoppingBag} label="Products" value={stats.productCount} />
        <StatCard icon={Tags} label="Categories" value={stats.categoryCount} />
        <StatCard icon={Package} label="Orders" value={stats.orderCount} />
        <StatCard icon={Wallet} label="Revenue (all orders)" value={formatPrice(stats.revenue)} />
      </div>

      <section className="admin-panel">
        <h2>Recent orders</h2>
        <table className="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{order.user?.name || '—'}</td>
                <td><span className={`admin-badge admin-badge--${order.orderStatus}`}>{order.orderStatus}</span></td>
                <td>{formatPrice(order.totalPrice)}</td>
              </tr>
            ))}
            {!recentOrders.length && <tr><td colSpan={4} className="admin-empty-row">No orders yet</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="admin-stat-card">
      <Icon size={20} />
      <div><span>{label}</span><strong>{value}</strong></div>
    </div>
  )
}
