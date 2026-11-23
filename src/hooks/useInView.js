import { useEffect, useState } from 'react'
import { hasIO, prefersReducedMotion } from '../utils/helpers'

/**
 * Becomes true once the element scrolls into view, then stops watching
 * (same rule as the original `.rv` observer: rootMargin 0 0 -10% 0).
 */
export default function useInView(ref, rootMargin = '0px 0px -10% 0px') {
  const [inView, setInView] = useState(() => prefersReducedMotion() || !hasIO())

  useEffect(() => {
    const el = ref.current
    if (inView || !el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, inView, rootMargin])

  return inView
}
