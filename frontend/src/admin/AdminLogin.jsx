import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext'

export default function AdminLogin() {
  const { user, signIn } = useStore()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (user?.role === 'admin') return <Navigate to="/admin" replace />

  const submit = async (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    setSubmitting(true)
    setError('')
    try {
      const me = await signIn({ email: data.email, password: data.password })
      if (me.role !== 'admin') {
        setError('This account does not have admin access.')
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={submit}>
        <p className="admin-login__brand">elegance republic.</p>
        <h1>Admin sign in</h1>
        <label className="er-field"><span>Email</span><input name="email" type="email" required autoComplete="email" /></label>
        <label className="er-field"><span>Password</span><input name="password" type="password" required autoComplete="current-password" /></label>
        {error && <p className="er-form-error">{error}</p>}
        <button className="er-btn er-btn--dark" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
