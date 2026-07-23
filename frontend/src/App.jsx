import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Account from './pages/Account'
import AdminCategories from './admin/AdminCategories'
import AdminCustomers from './admin/AdminCustomers'
import AdminDashboard from './admin/AdminDashboard'
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/AdminLogin'
import AdminOrderDetail from './admin/AdminOrderDetail'
import AdminOrders from './admin/AdminOrders'
import AdminProductForm from './admin/AdminProductForm'
import AdminProducts from './admin/AdminProducts'
import Cart from './pages/Cart'
import CursorRing from './components/CursorRing'
import Category from './pages/Category'
import Checkout from './pages/Checkout'
import Collection from './pages/Collection'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'
import OrderConfirmation from './pages/OrderConfirmation'
import Product from './pages/Product'
import ResetPassword from './pages/ResetPassword'
import Search from './pages/Search'
import Shop from './pages/Shop'
import VerifyEmail from './pages/VerifyEmail'
import Wishlist from './pages/Wishlist'
import { StoreProvider } from './store/StoreContext'

export default function App() {
  return (
    <StoreProvider>
      <CursorRing/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<AdminDashboard/>}/>
            <Route path="products" element={<AdminProducts/>}/>
            <Route path="products/new" element={<AdminProductForm/>}/>
            <Route path="products/:id" element={<AdminProductForm/>}/>
            <Route path="categories" element={<AdminCategories/>}/>
            <Route path="orders" element={<AdminOrders/>}/>
            <Route path="orders/:id" element={<AdminOrderDetail/>}/>
            <Route path="customers" element={<AdminCustomers/>}/>
          </Route>
          <Route element={<MainLayout/>}>
            <Route path="/home" element={<Home/>}/>
            <Route path="/collection" element={<Collection/>}/>
            <Route path="/category" element={<Category/>}/>
            <Route path="/product" element={<Product/>}/>
            <Route path="/product/:id" element={<Product/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<Checkout/>}/>
            <Route path="/order-confirmation" element={<OrderConfirmation/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/verify-email" element={<VerifyEmail/>}/>
            <Route path="/wishlist" element={<Wishlist/>}/>
            <Route path="/shop" element={<Shop/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
