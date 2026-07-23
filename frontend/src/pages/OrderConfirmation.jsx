import { CheckCircle2, PackageCheck } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { formatPrice } from '../utils/storefront'

export default function OrderConfirmation() {
  const [params] = useSearchParams()
  const { orders, user } = useStore()
  const order = orders.find((item) => item.id === params.get('id')) || orders[0]
  if (!order) return <div className="er-page"><div className="er-empty"><h1>Order not found</h1><Link className="er-btn er-btn--dark" to="/shop">Continue shopping</Link></div></div>
  const firstName = (order.shippingAddress?.name || user?.name || '').split(' ')[0]
  return <div className="er-confirmation"><CheckCircle2 className="er-confirmation__check"/><p className="er-kicker">Order confirmed</p><h1>Thank you, {firstName}.</h1><p>Your order <strong>{order.id}</strong> has been received. A confirmation would be sent to {user?.email} in a fully connected production store.</p><div className="er-confirmation__card"><PackageCheck/><div><h2>What happens next?</h2><p>We will prepare and quality-check your pieces before dispatch. Status: <b>{order.status}</b>.</p></div></div><dl><div><dt>Order total</dt><dd>{formatPrice(order.total)}</dd></div><div><dt>Payment</dt><dd>{order.paymentMethod === 'cod' ? 'Cash on delivery' : order.paymentMethod}</dd></div><div><dt>Delivery to</dt><dd>{order.shippingAddress?.city}, {order.shippingAddress?.province}</dd></div></dl><div className="er-confirmation__actions"><Link className="er-btn er-btn--dark" to="/account">View my orders</Link><Link className="er-btn er-btn--light" to="/shop">Continue shopping</Link></div></div>
}
  