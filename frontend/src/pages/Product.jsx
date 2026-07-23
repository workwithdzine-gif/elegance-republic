import { CheckCircle2, ChevronDown, Heart, Minus, Plus, Star, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import { useStore } from '../store/StoreContext'
import { discountPercent, formatPrice, imageFallback, productImage } from '../utils/storefront'

export default function Product() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { addToCart, wishlist, toggleWishlist, setCartOpen } = useStore()
  const { products, loading } = useProducts()
  const product = products.find((item) => item.id === params.get('id')) || products[0]

  if (loading && !product) return <div className="er-page"><p className="er-loading-note">Loading product…</p></div>
  if (!product) return <div className="er-page"><p className="er-loading-note">Product not found.</p></div>

  return <ProductDetail product={product} products={products} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} setCartOpen={setCartOpen} navigate={navigate} />
}

function ProductDetail({ product, products, addToCart, wishlist, toggleWishlist, setCartOpen, navigate }) {
  const [size, setSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const saved = wishlist.includes(product.id)
  const related = useMemo(() => products.filter((item) => item.id !== product.id && (item.subcategory === product.subcategory || item.category === product.category)).slice(0, 6), [products, product])

  const add = (open = true) => { addToCart(product, quantity, size); if (open) setCartOpen(true) }
  const buy = () => { add(false); navigate('/checkout') }

  return (
    <div className="product-page">
      <section className="pp">
        <div className="pp-media">
          <figure className="pp-shot"><img src={productImage(product)} alt={product.title} onError={imageFallback}/></figure>
          <figure className="pp-shot"><img src={productImage(product, 1)} alt={`${product.title} alternate view`} onError={imageFallback}/></figure>
        </div>
        <aside className="pp-panel">
          <nav className="er-breadcrumb"><Link to="/">Home</Link><span>/</span><Link to={`/collection?cat=${product.categorySlug}`}>{product.category}</Link></nav>
          <p className="er-kicker">{product.collection}</p>
          <h1 className="pp-name">{product.title}</h1>
          <div className="pp-price"><span className="now">{formatPrice(product.price)}</span><span className="was">{formatPrice(product.comparePrice)}</span><span className="off">-{discountPercent(product.price, product.comparePrice)}%</span></div>
          <div className="er-rating"><div>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < Math.round(product.rating) ? 'currentColor' : 'none'}/>)}</div><span>{product.rating} · {product.sold} sold</span></div>
          <p className={`er-stock ${product.inStock ? '' : 'is-out'}`}><span/>{product.inStock ? 'In stock and ready to dispatch' : 'Currently out of stock'}</p>

          <div className="pp-size-block"><div className="pp-size-label"><span>Select size</span><a href="#size-guide">Size guide</a></div><div className="pp-sizes">{product.sizes.map((item) => <button className="pp-size" key={item} aria-pressed={size === item} onClick={() => setSize(item)}>{item}</button>)}</div></div>
          <div className="er-product-qty"><span>Quantity</span><div className="er-quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus/></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus/></button></div></div>

          <div className="pp-cta"><button className="pp-btn pp-btn--add" onClick={() => add(true)} disabled={!product.inStock}>Add to cart — {formatPrice(product.price * quantity)}</button><button className="pp-btn pp-btn--buy" onClick={buy} disabled={!product.inStock}>Buy it now</button></div>
          <button className="pp-save" aria-pressed={saved} onClick={() => toggleWishlist(product.id)}><Heart fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Saved to wishlist' : 'Add to wishlist'}</button>

          <div className="pp-accs">
            <details className="pp-acc" open><summary className="pp-acc__head">Description <ChevronDown className="pp-chev"/></summary><div className="pp-acc__body"><p className="pp-acc__copy">{product.description} Designed in Pakistan with breathable fabric, considered structure, and dependable finishing.</p></div></details>
            <details className="pp-acc" id="size-guide"><summary className="pp-acc__head">Size & fit <ChevronDown className="pp-chev"/></summary><div className="pp-acc__body"><table className="pp-size-chart"><thead><tr><th>Size</th><th>Chest</th><th>Length</th></tr></thead><tbody>{product.sizes.slice(0, 5).map((item, index) => <tr key={item}><td>{item}</td><td>{36 + index * 2}″</td><td>{40 + index}″</td></tr>)}</tbody></table><p className="pp-chart-note">Measurements are garment measurements and may vary by up to half an inch.</p></div></details>
            <details className="pp-acc"><summary className="pp-acc__head">Delivery & returns <ChevronDown className="pp-chev"/></summary><div className="pp-acc__body"><p className="pp-acc__copy">Nationwide delivery in 3–5 working days. Unworn items can be exchanged within 14 days with tags attached.</p></div></details>
          </div>
          <div className="er-product-assurance"><Truck/><span>Free delivery above PKR.5,000</span><CheckCircle2/><span>Quality inspected</span></div>
        </aside>
      </section>

      <section className="pp-more"><h2 className="pp-more__title">More {product.subcategory}</h2><ProductGrid products={related}/></section>
    </div>
  )
}
