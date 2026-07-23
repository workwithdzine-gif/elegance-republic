import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import { useStore } from '../store/StoreContext'

export default function Wishlist() {
  const { wishlist } = useStore()
  const { products } = useProducts()
  const saved = products.filter((product) => wishlist.includes(product.id))
  return <div className="er-page"><header className="er-page-head"><p className="er-kicker">Saved for later</p><h1>Wishlist</h1><p>{saved.length ? `${saved.length} ${saved.length === 1 ? 'piece' : 'pieces'} in your edit.` : 'Keep the pieces you love together in one place.'}</p></header>{saved.length ? <ProductGrid products={saved}/> : <div className="er-empty"><Heart/><h2>Your wishlist is empty</h2><p>Tap the heart on any product to save it here.</p><Link className="er-btn er-btn--dark" to="/shop">Explore collection</Link></div>}</div>
}
