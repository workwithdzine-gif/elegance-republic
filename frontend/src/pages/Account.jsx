import { LogOut, MapPin, Package, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { formatPrice } from '../utils/storefront'

export default function Account() {
  const { user, orders, addresses, signIn, signUp, signOut, saveAddress, notify } = useStore()
  const [mode, setMode] = useState('login')
  const [tab, setTab] = useState('orders')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    const submit = async (event) => {
      event.preventDefault()
      const data = Object.fromEntries(new FormData(event.currentTarget))
      setSubmitting(true)
      try {
        if (mode === 'login') {
          await signIn({ email: data.email, password: data.password })
        } else {
          await signUp({ name: data.name, email: data.email, password: data.password })
        }
      } catch (err) {
        notify(err.message || 'Something went wrong, please try again')
      } finally {
        setSubmitting(false)
      }
    }
    return <div className="er-auth"><section className="er-auth__art"><p className="er-kicker">Elegance Republic</p><h1>Your wardrobe,<br/>remembered.</h1><p>Save favorites, move through checkout faster, and keep every order together.</p><div><Package/><span>Persistent local order history</span></div><div><MapPin/><span>Saved delivery details</span></div></section><section className="er-auth__form"><div className="er-auth-tabs"><button className={mode === 'login' ? 'is-active' : ''} onClick={() => setMode('login')}>Sign in</button><button className={mode === 'register' ? 'is-active' : ''} onClick={() => setMode('register')}>Create account</button></div><form onSubmit={submit}><p className="er-kicker">{mode === 'login' ? 'Welcome back' : 'Join the republic'}</p><h2>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</h2>{mode === 'register' && <label className="er-field"><span>Full name</span><input name="name" required autoComplete="name"/></label>}<label className="er-field"><span>Email address</span><input name="email" type="email" required autoComplete="email"/></label><label className="er-field"><span>Password</span><input name="password" type="password" minLength="8" required autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/></label>{mode === 'login' && <Link className="er-text-link er-forgot" to="/reset-password">Forgot password?</Link>}<button className="er-btn er-btn--dark" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button></form></section></div>
  }

  const save = (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget))
    saveAddress(data); notify('Delivery address saved')
  }

  return <div className="er-account er-page"><header className="er-account__head"><div><p className="er-kicker">My account</p><h1>Hello, {user.name}</h1><p>{user.email}</p></div><button className="er-btn er-btn--light" onClick={signOut}><LogOut/> Sign out</button></header><div className="er-account__tabs"><button className={tab === 'orders' ? 'is-active' : ''} onClick={() => setTab('orders')}><Package/> Orders</button><button className={tab === 'profile' ? 'is-active' : ''} onClick={() => setTab('profile')}><UserRound/> Profile</button><button className={tab === 'addresses' ? 'is-active' : ''} onClick={() => setTab('addresses')}><MapPin/> Addresses</button></div>{tab === 'orders' && <section className="er-account-panel"><div className="er-panel-title"><div><p className="er-kicker">Order history</p><h2>Your orders</h2></div><span>{orders.length} orders</span></div>{orders.length ? <div className="er-order-list">{orders.map((order) => <article key={order.id}><header><div><h3>{order.id}</h3><p>{new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p></div><span>{order.status}</span></header><div><p>{order.items.length} line items</p><strong>{formatPrice(order.total)}</strong></div></article>)}</div> : <div className="er-empty"><Package/><h3>No orders yet</h3><p>Your completed checkout orders will appear here.</p><Link className="er-btn er-btn--dark" to="/shop">Start shopping</Link></div>}</section>}{tab === 'profile' && <section className="er-account-panel"><p className="er-kicker">Personal details</p><h2>Profile</h2><div className="er-profile-card"><UserRound/><div><b>{user.name}</b><p>{user.email}</p><span>Email verified</span></div></div><p className="er-account-copy">Profile details are stored only in this browser for the frontend demonstration.</p></section>}{tab === 'addresses' && <section className="er-account-panel"><p className="er-kicker">Delivery details</p><h2>Addresses</h2>{addresses.map((address) => <address className="er-address" key={address.id}><MapPin/><div><b>{address.name}</b><p>{address.line1}</p><p>{address.city}, {address.province} {address.postalCode}</p><p>{address.phone}</p></div></address>)}<form className="er-address-form er-form-grid" onSubmit={save}><label className="er-field"><span>Name</span><input name="name" defaultValue={user.name} required/></label><label className="er-field"><span>Phone</span><input name="phone" required/></label><label className="er-field er-field--wide"><span>Street address</span><input name="line1" required/></label><label className="er-field"><span>City</span><input name="city" required/></label><label className="er-field"><span>Province</span><input name="province" required/></label><label className="er-field"><span>Postal code</span><input name="postalCode"/></label><button className="er-btn er-btn--dark" type="submit">Save address</button></form></section>}</div>
}