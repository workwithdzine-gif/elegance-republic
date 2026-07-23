import { useCategories } from '../hooks/useCategories'

export default function SectionHead({ title, gender = 'men', active = 'all', onSelect, hideWesternWear = false }) {
  const { categories: tree } = useCategories()
  const department = tree.find((c) => c.slug === gender)
  const categories = (department?.children || []).filter((category) => !hideWesternWear || category.name !== 'Western Wear')

  return (
    <header className="coll-head">
      <h1 className="coll-head__title">{title}</h1>
      <div className="coll-head__tabs no-scrollbar" role="tablist" aria-label={`${title} categories`}>
        <button className={`coll-tab ${active === 'all' ? 'is-active' : ''}`} onClick={() => onSelect?.('all')} type="button">All</button>
        {categories.map((category) => (
          <button key={category.slug} data-category={category.name.toLowerCase().replaceAll(' ', '-')} className={`coll-tab ${active === category.slug ? 'is-active' : ''}`} onClick={() => onSelect?.(category.slug)} type="button">
            {category.name}
          </button>
        ))}
      </div>
    </header>
  )
}
