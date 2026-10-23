import { useEffect, useRef, useState } from 'react'

/* Flips to true once the element scrolls into view, then stops observing. */
export function useInView({ threshold = .2, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return
      setInView(true)
      io.disconnect()
    }, { threshold, rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
