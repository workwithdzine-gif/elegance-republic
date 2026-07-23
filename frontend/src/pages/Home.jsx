import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import SectionHead from '../components/SectionHead'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import { useStore } from '../store/StoreContext'

const TAB_INFO = {
  men: { title: 'Men', gender: 'men' },
  women: { title: 'Women', gender: 'women' },
  shop: { title: 'Shop', gender: null },
  new: { title: 'New Arrival', gender: null, collection: 'New Arrivals' },
}

export default function Home() {
  const [params, setParams] = useSearchParams()
  const { gender, setGender } = useStore()
  const { products, loading } = useProducts()
  const { categories: tree } = useCategories()
  const tab = TAB_INFO[params.get('tab')] ? params.get('tab') : gender
  const info = TAB_INFO[tab]
  const activeCategory = params.get('cat') || 'all'
  const department = info.gender || gender

  useEffect(() => { if (info.gender) setGender(info.gender) }, [info.gender, setGender])

  const visible = useMemo(() => products.filter((product) => {
    if (info.gender && product.gender.toLowerCase() !== info.gender) return false
    if (info.collection && product.collection !== info.collection) return false
    if (activeCategory !== 'all') {
      const departmentNode = tree.find((c) => c.slug === department)
      const category = (departmentNode?.children || []).find((item) => item.slug === activeCategory)
      if (category && product.category !== category.name) return false
    }
    return true
  }), [products, tree, activeCategory, department, info.collection, info.gender])

  const chooseCategory = (cat) => {
    const next = new URLSearchParams(params)
    next.set('tab', tab)
    if (cat === 'all') next.delete('cat'); else next.set('cat', cat)
    setParams(next)
  }

  return (
    <div id="home-root">
      <section className="er-listing-page mx-auto w-full max-w-[1500px] px-5">
        <SectionHead title={info.title} gender={department} active={activeCategory} onSelect={chooseCategory} hideWesternWear/>
        <p className="er-mobile-product-count">{visible.length} products</p>
        <div className="pb-16">{loading ? <p className="er-loading-note">Loading products…</p> : <ProductGrid products={visible}/>}</div>
      </section>
    </div>
  )
}
