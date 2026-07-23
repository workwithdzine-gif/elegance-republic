import { Search as SearchIcon, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import { matchesSearch } from '../utils/storefront'

const suggestions = ['Shalwar Kameez', 'Kurta', 'Co-Ord', 'Premium', 'New Arrivals']

export default function Search() {
  const [params, setParams] = useSearchParams()
  const { products } = useProducts()
  const [query, setQuery] = useState(params.get('q') || '')
  const results = useMemo(() => query.trim() ? products.filter((product) => matchesSearch(product, query)) : [], [products, query])
  const search = (value) => { setQuery(value); const next = new URLSearchParams(); if (value.trim()) next.set('q', value.trim()); setParams(next, { replace: true }) }
  return <div className="srch-page"><header className="srch-head"><p className="er-kicker">Find your next piece</p><h1>Search</h1><div className="srch-field"><SearchIcon/><input autoFocus value={query} onChange={(event) => search(event.target.value)} placeholder="Search products, categories and collections" aria-label="Search products"/>{query && <button onClick={() => search('')} aria-label="Clear search"><X/></button>}</div></header>{!query.trim() ? <section className="srch-suggest"><p>Popular searches</p><div>{suggestions.map((item) => <button key={item} onClick={() => search(item)}>{item}</button>)}</div></section> : <section className="srch-results"><div className="srch-results__head"><p>Results for "{query}"</p><span>{results.length} products</span></div><ProductGrid products={results} emptyTitle="Nothing matched your search" emptyText="Check the spelling or try a broader term."/></section>}</div>
}
