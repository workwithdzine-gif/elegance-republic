import { ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usersAPI } from '../lib/usersApi'
import { useStore } from '../store/StoreContext'

export default function AdminCustomers() {
  const { user: me } = useStore()
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    setLoading(true)
    usersAPI.list({ page, limit: 20 })
      .then((data) => { setUsers(data.users); setTotal(data.total) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleRole = async (u) => {
    const nextRole = u.role === 'admin' ? 'customer' : 'admin'
    if (!window.confirm(`Make ${u.name} ${nextRole === 'admin' ? 'an admin' : 'a regular customer'}?`)) return
    setBusyId(u._id)
    try {
      const updated = await usersAPI.updateRole(u._id, nextRole)
      setUsers((current) => current.map((item) => item._id === u._id ? updated : item))
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (u) => {
    if (!window.confirm(`Remove ${u.name}'s account? This can't be undone.`)) return
    setBusyId(u._id)
    try {
      await usersAPI.remove(u._id)
      load()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <h1 className="admin-page-title">Customers</h1>
      {loading ? <p className="admin-loading">Loading…</p> : (
        <>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th /></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td className="admin-muted">{u.email}</td>
                  <td><span className={`admin-badge ${u.role === 'admin' ? 'admin-badge--active' : ''}`}>{u.role}</span></td>
                  <td className="admin-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="admin-row-actions">
                    {u._id !== me?.id && u._id !== me?._id && (
                      <>
                        <button className="admin-icon-btn" title={u.role === 'admin' ? 'Revoke admin access' : 'Make admin'} disabled={busyId === u._id} onClick={() => toggleRole(u)}>
                          {u.role === 'admin' ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                        </button>
                        <button className="admin-icon-btn admin-icon-btn--danger" title="Remove customer" disabled={busyId === u._id} onClick={() => remove(u)}>
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                    {(u._id === me?.id || u._id === me?._id) && <span className="admin-muted">You</span>}
                  </td>
                </tr>
              ))}
              {!users.length && <tr><td colSpan={5} className="admin-empty-row">No customers yet</td></tr>}
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
