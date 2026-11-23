import { useEffect, useState } from 'react'
import { COUPLE } from '../data/invite'
import { asset, prefersReducedMotion } from '../utils/helpers'

const PEARLS = asset('assets/media/pearls-strand.webp')
/* how long the opening animation runs before the splash is removed */
const OPEN_MS = 2000

/*
 * Splash: a sealed velvet envelope shown while the intro film loads in the background.
 * Once the film is ready the guest clicks, the flap opens, the card peeks out
 * and the splash fades into the glitter intro.
 */
export default function Splash({ ready, progress, guest, onOpen }) {
  const [phase, setPhase] = useState('idle') // idle → opening → gone
  const [touch] = useState(() => window.matchMedia('(hover: none)').matches)

  useEffect(() => {
    if (phase !== 'opening') return
    const id = setTimeout(() => setPhase('gone'), prefersReducedMotion() ? 0 : OPEN_MS)
    return () => clearTimeout(id)
  }, [phase])

  if (phase === 'gone') return null

  const open = () => {
    if (!ready || phase !== 'idle') return
    /* Keep activation inside the user gesture so media can start reliably. */
    onOpen()
    setPhase('opening')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }

  const className = ['splash', ready && 'is-ready', phase === 'opening' && 'is-opening'].filter(Boolean).join(' ')

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      aria-label={ready ? 'Open the invitation' : 'The invitation is loading'}
      aria-busy={!ready}
      onClick={open}
      onKeyDown={onKeyDown}
    >
      {/* ?g=Yogesh → "Dear Yogesh,"; without a name the same greeting as the letter */}
      <p className="splash__to">{guest ? `Dear ${guest},` : 'Dear family & friends,'}</p>
      <p className="splash__t">
        A Special Message
        <br />
        Awaits…
      </p>

      <div className="splash__env" aria-hidden="true">
        <img className="splash__pearls splash__pearls--tr" src={PEARLS} alt="" />
        <div className="splash__back" />
        <div className="splash__card">
          <span>{COUPLE.monogram}</span>
        </div>
        <div className="splash__front">
          <svg viewBox="0 0 145 100" preserveAspectRatio="none">
            <path d="M0 100 L60 50 M145 100 L85 50" />
          </svg>
        </div>
        <div className="splash__flapw">
          <div className="splash__flap">
            <svg viewBox="0 0 145 58" preserveAspectRatio="none">
              <path d="M0 0 L72.5 58 L145 0" />
            </svg>
          </div>
        </div>
        <span className="splash__seal">
          <span>{COUPLE.monogram}</span>
        </span>
        <img className="splash__pearls splash__pearls--bl" src={PEARLS} alt="" />
      </div>

      <p className="splash__cta">
        {ready ? (touch ? 'Tap to open…' : 'Click to open…') : 'Preparing your invitation…'}
      </p>
      <div className="splash__bar" aria-hidden="true">
        <i style={{ '--p': progress.toFixed(3) }} />
      </div>
    </div>
  )
}
