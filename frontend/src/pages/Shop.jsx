import { useMemo, useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import { sortProducts } from '../utils/storefront'

export default function Shop() {
  const { products, loading } = useProducts()
  const [department, setDepartment] = useState('all')
  const [sort, setSort] = useState('featured')
  const visible = useMemo(() => sortProducts(products.filter((product) => department === 'all' || product.gender.toLowerCase() === department), sort), [products, department, sort])
  return <div className="er-page er-shop"><header className="er-page-head"><p className="er-kicker">The complete collection</p><h1>Shop</h1><p>Eastern wear, western staples, footwear, and finishing touches for every wardrobe.</p></header><div className="er-shop-controls"><div className="er-pills"><button className={department === 'all' ? 'is-active' : ''} onClick={() => setDepartment('all')}>All</button><button className={department === 'men' ? 'is-active' : ''} onClick={() => setDepartment('men')}>Men</button><button className={department === 'women' ? 'is-active' : ''} onClick={() => setDepartment('women')}>Women</button></div><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="best">Best selling</option><option value="low">Price low to high</option><option value="high">Price high to low</option></select></div>{loading ? <p className="er-loading-note">Loading products…</p> : <ProductGrid products={visible}/>}</div>
}

