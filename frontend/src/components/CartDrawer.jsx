import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { formatPrice, imageFallback, productImage } from '../utils/storefront'

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, subtotal, updateQuantity, removeFromCart } = useStore()

  useEffect(() => {
    if (!cartOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [cartOpen])

  if (!cartOpen) return null
  return (
    <div className="er-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button className="er-drawer__shade" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" />
      <aside className="er-drawer__panel">
        <header className="er-drawer__head">
          <div><p className="er-kicker">Shopping bag</p><h2>Your Cart ({cart.length})</h2></div>
          <button type="button" className="er-icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X/></button>
        </header>
        <div className="er-drawer__body">
          {!cart.length ? (
            <div className="er-drawer__empty"><ShoppingBag size={32}/><h3>Your cart is empty</h3><p>Discover timeless pieces made for every occasion.</p><Link className="er-btn er-btn--dark" to="/shop" onClick={() => setCartOpen(false)}>Start shopping</Link></div>
          ) : cart.map((item) => (
            <article className="er-drawer-item" key={item.cartKey}>
              <Link to={`/product?id=${item.id}`} onClick={() => setCartOpen(false)} className="er-drawer-item__image"><img src={productImage(item)} alt={item.title} onError={imageFallback}/></Link>
              <div className="er-drawer-item__copy">
                <div><Link to={`/product?id=${item.id}`} onClick={() => setCartOpen(false)}>{item.title}</Link><p>Size: {item.selectedSize}</p></div>
                <div className="er-drawer-item__foot">
                  <div className="er-quantity"><button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)} aria-label="Decrease quantity"><Minus/></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)} aria-label="Increase quantity"><Plus/></button></div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <button className="er-remove" onClick={() => removeFromCart(item.cartKey)} aria-label={`Remove ${item.title}`}><Trash2/></button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!!cart.length && <footer className="er-drawer__foot"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p>Shipping and discounts calculated at checkout.</p><Link className="er-btn er-btn--dark" to="/checkout" onClick={() => setCartOpen(false)}>Checkout</Link><Link className="er-text-link" to="/cart" onClick={() => setCartOpen(false)}>View cart</Link></footer>}
      </aside>
    </div>
  )
}

