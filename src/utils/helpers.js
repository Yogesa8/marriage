/* Small shared helpers (same behaviour as the original inline script) */

/** Resolve a file from /public so it also works when the app is served from a sub-folder */
export const asset = (path) => import.meta.env.BASE_URL + path

export const clamp = (v) => Math.max(0, Math.min(1, v))

export function buzz(ms) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms)
  } catch {
    /* vibration not supported */
  }
}

/** Visitor asked for reduced motion: everything is shown in its final state */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion:reduce)').matches

export const hasIO = () => typeof window !== 'undefined' && 'IntersectionObserver' in window

/* personal invitation link: ?g=Sharma%20Family → "Sharma Family" (empty without ?g=) */
export function getGuestName() {
  if (typeof window === 'undefined') return ''
  const name = (new URLSearchParams(window.location.search).get('g') || '').trim().replace(/\s+/g, ' ').slice(0, 60)
  /* ?g=yogesh → "Yogesh": first letter of every word in capitals, the rest as typed */
  return name.replace(/(^|\s)(\S)/g, (m, sp, ch) => sp + ch.toUpperCase())
}
