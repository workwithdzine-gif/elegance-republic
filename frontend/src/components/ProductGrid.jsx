import ProductCard from './ProductCard'

export default function ProductGrid({ products, emptyTitle = 'No products found', emptyText = 'Try another category or remove some filters.' }) {
  if (!products.length) {
    return (
      <div className="er-empty">
        <span className="er-empty__mark">ER</span>
        <h2>{emptyTitle}</h2>
        <p>{emptyText}</p>
      </div>
    )
  }
  return <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
}

