import { useEffect, useRef, useState } from 'react'
import { asset, clamp, prefersReducedMotion } from '../utils/helpers'
import { FILTERED_VENUES as VENUES } from '../utils/occasion'
import Reveal from './Reveal'

const STEPS = [0.04, 0.52]
const INITIAL = VENUES.map(() => false)

/* 5 · Venue: locations reveal in sequence while the section is pinned */
export default function Venue() {
  const secRef = useRef(null)
  const [shown, setShown] = useState(INITIAL)
  const [still] = useState(prefersReducedMotion)

  useEffect(() => {
    const sec = secRef.current
    const single = VENUES.length === 1
    let ps = still ? 1 : 0
    let pt = ps
    let raf = 0
    let lastKey = ''

    function draw() {
      ps += (pt - ps) * 0.12
      if (Math.abs(pt - ps) < 0.0005) ps = pt
      const next = VENUES.map((_, i) => ps >= (STEPS[i] || STEPS[0]))
      const key = JSON.stringify(next)
      if (key !== lastKey) {
        lastKey = key
        setShown(next)
      }
      raf = ps !== pt ? requestAnimationFrame(draw) : 0
    }

    function measure() {
      if (still) pt = 1
      else {
        const r = sec.getBoundingClientRect()
        if (single) {
          pt = clamp((window.innerHeight - r.top) / window.innerHeight)
          if (!raf) raf = requestAnimationFrame(draw)
          return
        }
        const lead = window.innerHeight * 0.2
        const span = sec.offsetHeight - window.innerHeight
        pt = clamp((lead - r.top) / Math.max(1, span + lead))
      }
      if (!raf) raf = requestAnimationFrame(draw)
    }

    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    measure()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [still])

  return (
    <section
      ref={secRef}
      className={
        'sec s-night where' +
        (VENUES.length === 1 ? ' is-single' : '') +
        (still ? ' is-still' : '')
      }
      data-block="venue"
      data-block-name="5 · Место"
    >
      <div className="where__stage">
        <div className="wrap where__wrap">
          <Reveal as="h2" className="t">
            Where
          </Reveal>
          <Reveal as="p" className="sub">
            Find us at each celebration
          </Reveal>
          <div className="where__row">
            {VENUES.map((venue, i) => {
              const route = 'https://www.google.com/maps/dir/?api=1&destination=' +
                encodeURIComponent(venue.address)
              const active = shown[i] || still
              return (
                <article
                  key={venue.occasion}
                  className={
                    'where__place where__place--' + (i % 2 ? 'r' : 'l') + (shown[i] ? ' is-in' : '')
                  }
                  aria-hidden={!active}
                  inert={!active}
                >
                  <h3 className="where__occasion">{venue.occasion}</h3>
                  <figure className="where__figure">
                    <div className="where__figure-in">
                      <img
                        src={asset(venue.image)}
                        alt={`${venue.name} at night`}
                        loading="lazy"
                      />
                    </div>
                  </figure>
                  <h4 className="where__name">{venue.name}</h4>
                  <a
                    className="btn btn--gold where__route"
                    href={route}
                    target="_blank"
                    rel="noopener"
                  >
                    <svg
                      className="where__route-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z" />
                      <circle cx="12" cy="9" r="2.35" />
                    </svg>
                    <span>Get directions</span>
                  </a>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
