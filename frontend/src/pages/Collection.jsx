import { SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import SectionHead from '../components/SectionHead'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { findCategoryBySlug, findDepartment, getDescendantSlugs } from '../lib/categoryTree'
import { useStore } from '../store/StoreContext'
import { collectionNameFromSlug, sortProducts } from '../utils/storefront'

export default function Collection() {
  const [params, setParams] = useSearchParams()
  const { gender: storedGender, setGender } = useStore()
  const { products, loading } = useProducts()
  const { categories: tree } = useCategories()
  const gender = params.get('gender') || storedGender
  const categorySlug = params.get('cat') || 'all'
  const collectionSlug = params.get('collection') || 'all'
  const [sort, setSort] = useState('featured')
  const [price, setPrice] = useState('all')
  const [size, setSize] = useState('All')
  const [stock, setStock] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    const descendants = categorySlug === 'all' ? [] : getDescendantSlugs(tree, categorySlug)
    const collection = collectionNameFromSlug(collectionSlug)
    let list = products.filter((product) => {
      if (product.gender.toLowerCase() !== gender) return false
      if (categorySlug !== 'all' && !descendants.includes(product.categorySlug) && !descendants.includes(product.subcategorySlug)) return false
      if (collection && product.collection !== collection) return false
      if (collectionSlug === 'sale' && !(product.comparePrice > product.price)) return false
      if (price === 'under-5000' && product.price >= 5000) return false
      if (price === '5000-8000' && (product.price < 5000 || product.price > 8000)) return false
      if (price === 'above-8000' && product.price <= 8000) return false
      if (size !== 'All' && !product.sizes.includes(size)) return false
      if (stock === 'in' && !product.inStock) return false
      if (stock === 'out' && product.inStock) return false
      return true
    })
    return sortProducts(list, sort)
  }, [products, tree, categorySlug, collectionSlug, gender, price, size, sort, stock])

  const chooseCategory = (cat) => {
    const next = new URLSearchParams(params)
    next.set('gender', gender)
    if (cat === 'all') next.delete('cat'); else next.set('cat', cat)
    setParams(next)
  }
  const changeGender = (nextGender) => {
    setGender(nextGender)
    const next = new URLSearchParams(params)
    next.set('gender', nextGender); next.delete('cat')
    setParams(next)
  }
  const reset = () => { setPrice('all'); setSize('All'); setStock('all') }
  const category = findCategoryBySlug(tree, categorySlug)

  return (
    <div className="er-listing-page mx-auto w-full max-w-[1500px] px-5 pb-20">
      <div className="er-department-switch"><button className={gender === 'men' ? 'is-active' : ''} onClick={() => changeGender('men')}>Men</button><button className={gender === 'women' ? 'is-active' : ''} onClick={() => changeGender('women')}>Women</button></div>
      <SectionHead title={collectionNameFromSlug(collectionSlug) || findDepartment(tree, gender)?.name || ''} gender={gender} active={categorySlug} onSelect={chooseCategory}/>
      {category && <p className="er-collection-intro">{category.description}</p>}
      <div className="coll-bar">
        <button className="er-filter-button" onClick={() => setFiltersOpen(true)}><SlidersHorizontal/> Filters</button>
        <p className="er-result-count">{filtered.length} products</p>
        <div className="coll-bar__sort"><label htmlFor="collection-sort">Sort by</label><select id="collection-sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="best">Best selling</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
      </div>
      {loading ? <p className="er-loading-note">Loading products…</p> : <ProductGrid products={filtered}/>}
      {filtersOpen && <div className="er-filter-drawer" role="dialog" aria-modal="true"><button className="er-drawer__shade" onClick={() => setFiltersOpen(false)} aria-label="Close filters"/><aside><header><h2>Filters</h2><button className="er-icon-button" onClick={() => setFiltersOpen(false)}><X/></button></header><FilterSelect label="Price" value={price} onChange={setPrice} options={[["all","All prices"],["under-5000","Under PKR.5,000"],["5000-8000","PKR.5,000–8,000"],["above-8000","Above PKR.8,000"]]}/><FilterSelect label="Size" value={size} onChange={setSize} options={['All','XS','S','M','L','XL'].map((item) => [item,item])}/><FilterSelect label="Availability" value={stock} onChange={setStock} options={[["all","All"],["in","In stock"],["out","Out of stock"]]}/><button className="er-btn er-btn--dark" onClick={() => setFiltersOpen(false)}>Show {filtered.length} products</button><button className="er-text-link" onClick={reset}>Clear filters</button></aside></div>}
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return <label className="er-filter-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>
}
