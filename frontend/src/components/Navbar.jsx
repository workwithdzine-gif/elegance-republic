import { Heart, Search, ShoppingBag, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/StoreContext'

const BRAND = 'elegance republic.'
const TABS = [
  { slug: 'men', label: 'Men' },
  { slug: 'women', label: 'Women' },
  { slug: 'shop', label: 'Shop' },
  { slug: 'new', label: 'New Arrival' },
]

function Flag() {
  return <svg viewBox="0 0 20 14" width="20" height="14" aria-label="Pakistan"><rect width="20" height="14" fill="#01411C"/><rect width="5" height="14" fill="#fff"/><path fill="#fff" d="M13.9 7a3.2 3.2 0 1 1-3.02-3.2A2.6 2.6 0 1 0 13.9 7Z"/><path fill="#fff" d="m14.4 3.8.36.98 1.02.06-.79.66.26 1-.85-.57-.86.57.26-1-.79-.66 1.02-.06Z"/></svg>
}

export default function Navbar() {
  const location = useLocation()
  const { cartCount, setCartOpen, gender, setGender } = useStore()
  const params = new URLSearchParams(location.search)
  const activeTab = location.pathname === '/' ? (params.get('tab') || gender) : ''

  const tabLink = (tab) => (
    <Link
      key={tab.slug}
      to={`/?tab=${tab.slug}`}
      className={`site-nav__link ${tab.slug === activeTab ? 'is-active' : ''}`}
      onClick={() => {
        if (tab.slug === 'men' || tab.slug === 'women') setGender(tab.slug)
      }}
    >{tab.label}</Link>
  )

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>

      <header className="mobile-header">
        <div className="mobile-header__bar">
          <Link className="mobile-header__act" to="/search" aria-label="Search"><Search size={20}/></Link>
          <Link to="/" className="mobile-header__brand"><span className="mobile-header__wordmark">Elegance Republic</span></Link>
          <button className="mobile-header__act" type="button" aria-label={`Cart with ${cartCount} items`} onClick={() => setCartOpen(true)}>
            <ShoppingBag size={20}/>
          </button>
        </div>
        <nav className="mobile-header__tabs no-scrollbar" aria-label="Primary">{TABS.map((tab) => tabLink(tab))}</nav>
      </header>

      <div className="nav-frosted border-b border-line bg-white" data-nav-wrap>
        <div className="site-nav__row">
          <nav className="site-nav__side site-nav__group" aria-label="Primary">{TABS.map((tab) => tabLink(tab))}</nav>
          <Link to="/" className="justify-self-center" aria-label="Elegance Republic home"><span className="header-brand">{BRAND}</span></Link>
          <div className="site-nav__side site-nav__side--end">
            <Link to="/search" className="site-nav__icon" aria-label="Search"><Search size={20}/></Link>
            <Link to="/wishlist" className="site-nav__icon" aria-label="Wishlist"><Heart size={19}/></Link>
            <Link to="/account" className="site-nav__icon" aria-label="Account"><User size={19}/></Link>
            <span className="site-nav__flag"><Flag/></span>
            <button type="button" className="site-nav__cart" onClick={() => setCartOpen(true)}>Cart ({cartCount})</button>
          </div>
        </div>
      </div>

    </>
  )
}
