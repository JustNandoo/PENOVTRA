import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEMO_USER, SEED_ORDERS, lineItems, subtotalOf } from './data'

/* Client-side state for the UI slice: cart, a mock signed-in user and orders.
   Kept in localStorage so a refresh doesn't empty the cart. */

const KEY = 'pnv-market-v1'
const START = {
  cart: [
    { slug: 'pe-novtra-2-in-1', variant: 'std', qty: 1 },
    { slug: 'nutrisi-ab-mix', qty: 2 },
    { slug: 'media-tanam-organik', qty: 1 },
  ],
  user: null,
  orders: SEED_ORDERS,
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...START, ...JSON.parse(raw) } : START
  } catch {
    return START
  }
}

const StoreCtx = createContext(null)
const keyOf = l => l.slug + (l.variant ? ':' + l.variant : '')

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)
  const clearToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage may be blocked */ }
  }, [state])

  const addToCart = useCallback((slug, qty = 1, variant) => {
    setState(s => {
      const k = slug + (variant ? ':' + variant : '')
      const has = s.cart.some(l => keyOf(l) === k)
      const cart = has
        ? s.cart.map(l => keyOf(l) === k ? { ...l, qty: Math.min(10, l.qty + qty) } : l)
        : [...s.cart, { slug, variant, qty }]
      return { ...s, cart }
    })
    setToast({ slug, at: Date.now() })
  }, [])

  const setQty = useCallback((key, qty) => {
    setState(s => ({ ...s, cart: s.cart.map(l => keyOf(l) === key ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l) }))
  }, [])
  const removeLine = useCallback(key => setState(s => ({ ...s, cart: s.cart.filter(l => keyOf(l) !== key) })), [])

  const login = useCallback(() => setState(s => ({ ...s, user: DEMO_USER })), [])
  const logout = useCallback(() => setState(s => ({ ...s, user: null })), [])

  const placeOrder = useCallback(({ shipping, insured, pay, address }) => {
    const n = String(Math.floor(40 + Math.random() * 59)).padStart(4, '0')
    const id = `PNV-2611-${n}`
    setState(s => ({
      ...s,
      cart: [],
      orders: [{
        id, date: '16 Nov 2026', status: 'bayar', lines: s.cart, shipping, insured, pay, address,
        resi: '', eta: 'menunggu pembayaran',
        events: [['Sekarang', 'Menunggu pembayaran', 'Selesaikan dalam 24 jam', 'now'], ['16 Nov · 14.30', 'Pesanan dibuat', 'Checkout berhasil', 'done']],
      }, ...s.orders],
    }))
    return id
  }, [])

  const markPaid = useCallback(id => {
    setState(s => ({
      ...s,
      orders: s.orders.map(o => o.id !== id || o.status !== 'bayar' ? o : {
        ...o, status: 'proses', eta: 'estimasi tiba 20–22 Nov 2026',
        events: [
          ['Berikutnya', 'Dikirim', 'Nomor resi muncul di sini', 'next'],
          ['Berikutnya', 'Dikemas', 'Gudang Surabaya', 'next'],
          ['16 Nov · 14.41', 'Pembayaran diterima', o.pay, 'now'],
          ['16 Nov · 14.30', 'Pesanan dibuat', 'Checkout berhasil', 'done'],
        ],
      }),
    }))
  }, [])

  const value = useMemo(() => {
    const items = lineItems(state.cart)
    return {
      ...state,
      items,
      count: items.reduce((a, i) => a + i.qty, 0),
      subtotal: subtotalOf(items),
      toast, clearToast,
      addToCart, setQty, removeLine, login, logout, placeOrder, markPaid,
    }
  }, [state, toast, clearToast, addToCart, setQty, removeLine, login, logout, placeOrder, markPaid])

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)
