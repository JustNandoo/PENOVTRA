import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api'

/* Marketplace state:
   - catalog + categories, loaded from /api once per visit
   - the signed-in user, from /api/auth/me (session cookie)
   - the cart, kept in localStorage so guests can shop before signing in;
     prices shown here are display only, the server re-prices at checkout */

const CART_KEY = 'pnv-cart-v2'
const keyOf = l => l.slug + (l.variant ? ':' + l.variant : '')

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
    return Array.isArray(raw) ? raw.filter(l => l && typeof l.slug === 'string' && l.qty > 0) : []
  } catch {
    return []
  }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(loadCart)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [catalog, setCatalog] = useState([])
  const [categories, setCategories] = useState([])
  const [catalogState, setCatalogState] = useState('loading') // loading | ready | error
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch { /* storage may be blocked */ }
  }, [cart])

  const refreshUser = useCallback(async () => {
    try {
      const { user } = await api('/auth/me')
      setUser(user)
      return user
    } catch {
      setUser(null)
      return null
    } finally {
      setAuthReady(true)
    }
  }, [])

  const loadCatalog = useCallback(async () => {
    setCatalogState('loading')
    try {
      const [p, c] = await Promise.all([api('/products'), api('/categories')])
      setCatalog(p.products)
      setCategories(c.categories)
      setCatalogState('ready')
    } catch {
      setCatalogState('error')
    }
  }, [])

  useEffect(() => { refreshUser(); loadCatalog() }, [refreshUser, loadCatalog])

  const productBySlug = useCallback(slug => catalog.find(p => p.slug === slug), [catalog])

  const addToCart = useCallback((slug, qty = 1, variant) => {
    setCart(c => {
      const k = slug + (variant ? ':' + variant : '')
      return c.some(l => keyOf(l) === k)
        ? c.map(l => keyOf(l) === k ? { ...l, qty: Math.min(10, l.qty + qty) } : l)
        : [...c, { slug, variant, qty: Math.min(10, qty) }]
    })
    setToast({ slug, at: Date.now() })
  }, [])
  const setQty = useCallback((key, qty) => {
    setCart(c => c.map(l => keyOf(l) === key ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l))
  }, [])
  const removeLine = useCallback(key => setCart(c => c.filter(l => keyOf(l) !== key)), [])
  const clearCart = useCallback(() => setCart([]), [])
  const clearToast = useCallback(() => setToast(null), [])

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
  }, [])

  const value = useMemo(() => {
    // join cart lines with live catalog data; lines for removed products are skipped
    const items = cart.flatMap(l => {
      const product = catalog.find(p => p.slug === l.slug)
      if (!product || product.soon) return []
      const v = product.variants?.find(x => x.id === l.variant)
      return [{ ...l, product, variantName: v?.name, price: v?.price ?? product.price, key: keyOf(l) }]
    })
    return {
      cart, items,
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal: items.reduce((a, i) => a + i.price * i.qty, 0),
      user, setUser, authReady, refreshUser, logout,
      catalog, categories, catalogState, loadCatalog, productBySlug,
      categoryLabel: id => categories.find(c => c.id === id)?.label ?? '',
      toast, clearToast,
      addToCart, setQty, removeLine, clearCart,
    }
  }, [cart, catalog, categories, catalogState, user, authReady, toast, refreshUser, logout, loadCatalog, productBySlug, clearToast, addToCart, setQty, removeLine, clearCart])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)
