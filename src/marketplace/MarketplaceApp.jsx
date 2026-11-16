import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { StoreProvider, useStore } from './store'
import MarketNav from './components/MarketNav'
import { CartToast } from './components/atoms'
import { Footer } from '../components/Closing'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import { Login, Register, Verify, ForgotPassword } from './pages/Auth'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import Success from './pages/Success'
import Profile from './pages/Profile'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

/* Pages that need an account send guests to Masuk and come back afterwards */
function RequireUser({ children }) {
  const { user } = useStore()
  const { pathname } = useLocation()
  if (!user) return <Navigate to={`/marketplace/masuk?next=${encodeURIComponent(pathname)}`} replace />
  return children
}

export default function MarketplaceApp() {
  return (
    <StoreProvider>
      <ScrollToTop />
      <MarketNav />
      <Routes>
        <Route index element={<Catalog />} />
        <Route path="produk/:slug" element={<ProductDetail />} />
        <Route path="keranjang" element={<Cart />} />
        <Route path="masuk" element={<Login />} />
        <Route path="daftar" element={<Register />} />
        <Route path="verifikasi" element={<Verify />} />
        <Route path="lupa-sandi" element={<ForgotPassword />} />
        <Route path="checkout" element={<RequireUser><Checkout /></RequireUser>} />
        <Route path="pembayaran/:id" element={<RequireUser><Payment /></RequireUser>} />
        <Route path="berhasil/:id" element={<RequireUser><Success /></RequireUser>} />
        <Route path="profil" element={<RequireUser><Profile /></RequireUser>} />
        <Route path="*" element={<Navigate to="/marketplace" replace />} />
      </Routes>
      <Footer />
      <CartToast />
    </StoreProvider>
  )
}
