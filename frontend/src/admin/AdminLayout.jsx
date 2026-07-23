import { LayoutDashboard, LogOut, Package, ShoppingBag, Tags, Users } from 'lucide-react'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../store/StoreContext'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
]

export default function AdminLayout() {
  const { user, authLoading, signOut } = useStore()

  if (authLoading) return <div className="admin-boot">Loading…</div>
  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">elegance republic.</div>
        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}>
              <Icon size={18} /> <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="admin-sidebar__signout" onClick={signOut}><LogOut size={18} /> Sign out</button>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar__user">
            <span>{user.name}</span>
            <div className="admin-avatar">{user.name?.[0]?.toUpperCase()}</div>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
