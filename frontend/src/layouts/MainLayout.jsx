import { Outlet } from 'react-router-dom'
import CartDrawer from '../components/CartDrawer'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ScrollToTop from '../components/ScrollToTop'
import Toast from '../components/Toast'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <ScrollToTop/>
      <div className="site-sticky"><Navbar/></div>
      <main id="main-content"><Outlet/></main>
      <Footer/>
      <CartDrawer/>
      <Toast/>
    </div>
  )
}

