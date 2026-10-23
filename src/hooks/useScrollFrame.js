import { useEffect, useRef } from 'react'

/* Runs `fn` once per animation frame while the page scrolls (and once on mount / resize). */
export function useScrollFrame(fn) {
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    let ticking = false
    const run = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => { fnRef.current(); ticking = false })
    }
    run()
    window.addEventListener('scroll', run, { passive: true })
    window.addEventListener('resize', run)
    return () => {
      window.removeEventListener('scroll', run)
      window.removeEventListener('resize', run)
    }
  }, [])
}
