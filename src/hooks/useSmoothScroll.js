import { useEffect } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from '../utils/helpers'

/**
 * Lenis smooth scrolling for the whole page.
 * Starts only when `enabled` is true (after the intro unlocks the page)
 * and is skipped for visitors who prefer reduced motion.
 * Native scroll events still fire, so the calendar, timeline and reveal effects keep working.
 */
export default function useSmoothScroll(enabled) {
  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.085,
      wheelMultiplier: 0.9,
      anchors: true,
    })
    return () => lenis.destroy()
  }, [enabled])
}
