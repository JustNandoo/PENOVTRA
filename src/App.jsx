import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'

// the marketplace ships as its own chunk so the Home page stays as light as before
const MarketplaceApp = lazy(() => import('./marketplace/MarketplaceApp'))

/* Links like /#alat from the marketplace land on the matching Home section */
function HashScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (pathname !== '/' || !hash) return
    let tries = 0, raf = 0
    const go = () => {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else if (tries++ < 30) raf = requestAnimationFrame(go)
    }
    raf = requestAnimationFrame(go)
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <HashScroll />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/marketplace/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-forest-2" />}>
              <MarketplaceApp />
            </Suspense>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
