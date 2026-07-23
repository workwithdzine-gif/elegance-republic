import { ArrowLeft, LockKeyhole, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { formatPrice, imageFallback, productImage } from '../utils/storefront'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, subtotal, user, addresses, placeOrder } = useStore()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const shipping = subtotal >= 5000 ? 0 : 250
  const saved = addresses[0]

  const submit = async (event) => {
    event.preventDefault()
    if (!cart.length || submitting) return
    setError('')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    setSubmitting(true)
    try {
      const order = await placeOrder({
        shippingAddress: {
          fullName: data.name,
          phone: data.phone,
          street: data.address,
          city: data.city,
          state: data.province,
          postalCode: data.postalCode,
          country: 'Pakistan',
        },
      })
      navigate(`/order-confirmation?id=${encodeURIComponent(order.id)}`)
    } catch (err) {
      setError(err.message || 'Could not place your order, please try again')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return <div className="er-page"><div className="er-empty"><h1>Please sign in</h1><p>You need an account to place an order.</p><Link className="er-btn er-btn--dark" to="/account">Sign in</Link></div></div>
  if (!cart.length) return <div className="er-page"><div className="er-empty"><h1>Your cart is empty</h1><p>Add something to your cart before checking out.</p><Link className="er-btn er-btn--dark" to="/shop">Shop collection</Link></div></div>

  return (
    <div className="er-checkout">
      <header className="er-checkout__head"><Link to="/cart"><ArrowLeft/> Return to cart</Link><span className="header-brand">elegance republic.</span><span><LockKeyhole/> Secure checkout</span></header>
      <div className="er-checkout__grid">
        <form id="checkout-form" onSubmit={submit} className="er-checkout__form">
          <section><p className="er-checkout__step">01</p><div><h1>Contact</h1><div className="er-form-grid">
            <label className="er-field er-field--wide"><span>Email</span><input type="email" defaultValue={user?.email || ''} disabled/></label>
            <label className="er-field"><span>Full name</span><input name="name" defaultValue={user?.name || saved?.name || ''} required autoComplete="name"/></label>
            <label className="er-field"><span>Phone</span><input name="phone" defaultValue={saved?.phone || ''} required autoComplete="tel"/></label>
          </div></div></section>
          <section><p className="er-checkout__step">02</p><div><h2>Delivery address</h2><div className="er-form-grid">
            <label className="er-field er-field--wide"><span>Street address</span><input name="address" defaultValue={saved?.line1 || ''} required autoComplete="street-address"/></label>
            <label className="er-field"><span>City</span><input name="city" defaultValue={saved?.city || 'Lahore'} required autoComplete="address-level2"/></label>
            <label className="er-field"><span>Province</span><select name="province" defaultValue={saved?.province || 'Punjab'}><option>Punjab</option><option>Sindh</option><option>Khyber Pakhtunkhwa</option><option>Balochistan</option><option>Islamabad Capital Territory</option></select></label>
            <label className="er-field"><span>Postal code</span><input name="postalCode" defaultValue={saved?.postalCode || ''} autoComplete="postal-code"/></label>
          </div></div></section>
          <section><p className="er-checkout__step">03</p><div><h2>Payment</h2><div className="er-payment">
            <label className="is-active"><input type="radio" name="payment" value="cod" checked readOnly/><Truck/><span><b>Cash on delivery</b><small>Pay when your order arrives</small></span></label>
          </div><p className="er-checkout__safe">More payment options are coming soon.</p></div></section>
          {error && <p className="er-form-error">{error}</p>}
          <button className="er-btn er-btn--dark er-place-order" type="submit" disabled={submitting}>{submitting ? 'Placing order…' : `Place order · ${formatPrice(subtotal + shipping)}`}</button>
        </form>
        <aside className="er-checkout__summary">
          <p className="er-kicker">Your order</p>
          <div className="er-checkout-lines">{cart.map((item) => <article key={item.cartKey}><span><img src={productImage(item)} alt="" onError={imageFallback}/><b>{item.quantity}</b></span><div><h3>{item.title}</h3><p>Size {item.selectedSize}</p></div><strong>{formatPrice(item.price * item.quantity)}</strong></article>)}</div>
          <dl><div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div><div><dt>Shipping</dt><dd>{shipping ? formatPrice(shipping) : 'Free'}</dd></div><div><dt>Total</dt><dd>{formatPrice(subtotal + shipping)}</dd></div></dl>
        </aside>
      </div>
    </div>
  )
}
