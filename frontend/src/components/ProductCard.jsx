import { Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import { formatPrice, imageFallback, productImage } from '../utils/storefront'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, wishlist, toggleWishlist } = useStore()
  const saved = wishlist.includes(product.id)

  return (
   <article
  className={`product-card group is-visible${product.images?.length ? ' product-card--photo' : ''}`}
  style={{ '--reveal-delay': `${Math.min(index * 0.04, 0.32).toFixed(2)}s` }}
  data-product-id={product.id}
>
      <div className="product-card__media">
        <img className="product-card__img" src={productImage(product)} alt={product.title} loading="lazy" onError={imageFallback} />
        <img className="product-card__img product-card__img--hover" src={productImage(product, 1)} alt="" loading="lazy" onError={imageFallback} />
        {product.badge === 'New' && <span className="product-card__badge">New</span>}
        <button
          type="button"
          className="er-card-heart"
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button type="button" className="product-card__quick" onClick={() => addToCart(product)} disabled={!product.inStock}>
          <span>{product.inStock ? 'Quick Add' : 'Sold Out'}</span><Plus className="product-card__plus" />
        </button>
      </div>
      <div className="product-card__meta">
        <h3 className="product-card__title">{product.title}</h3>
        <span className="product-card__price">{formatPrice(product.price)}</span>
      </div>
      <Link className="product-card__link" to={`/product?id=${encodeURIComponent(product.id)}`} aria-label={product.title} />
    </article>
  )
}

