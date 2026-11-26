import { useEffect, useRef, useState } from 'react'
import { clamp, hasIO, prefersReducedMotion } from '../utils/helpers'
import { CELEBRATION_NOTE, FILTERED_CELEBRATIONS as CELEBRATIONS } from '../utils/occasion'
import Reveal from './Reveal'

/*
 * 4 · Celebrations:
 *   - 1 or 2 days (bride / single occasion): pins while scrolling and draws each thread by scroll progress
 *   - 3+ days (/ and /?v=groom): flows naturally in chronological order (2x2 on wide screens, 1-col on mobile)
 *     and reveals each day as it enters the viewport, plus the Baraat departure note below
 */

const IS_MULTI = CELEBRATIONS.length > 2

/* where each step happens within the section's scroll progress (0..1) */
const STEPS = CELEBRATIONS.length === 1
  ? [{ appear: 0.04, thread: [0.12, 0.92] }]
  : [
      { appear: 0.04, thread: [0.12, 0.36] }, // left column
      { appear: 0.48, thread: [0.56, 0.86] }, // right column
    ]

/* same rule as the original timeline: a moment lights up as the thread reaches it */
function litCount(v, n) {
  let c = 0
  for (let k = 0; k < n; k++) if (v >= (k + 0.2) / n - 0.05) c = k + 1
  return c
}

const INITIAL = IS_MULTI && (prefersReducedMotion() || !hasIO())
  ? { shown: CELEBRATIONS.map(() => true), lit: CELEBRATIONS.map((c) => c.items.length) }
  : { shown: CELEBRATIONS.map(() => false), lit: CELEBRATIONS.map(() => 0) }

export default function Celebrations() {
  const secRef = useRef(null)
  const colRefs = useRef([])
  const [view, setView] = useState(INITIAL)
  const [still] = useState(prefersReducedMotion)

  useEffect(() => {
    if (IS_MULTI) {
      if (still || !hasIO()) {
        CELEBRATIONS.forEach((_, i) => {
          const col = colRefs.current[i]
          if (col) col.style.setProperty('--pl', '1')
        })
        return
      }

      const io = new IntersectionObserver(
        (entries) => {
          const hit = []
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const idx = Number(entry.target.dataset.celIdx)
            if (!Number.isNaN(idx)) hit.push(idx)
            io.unobserve(entry.target)
          })
          if (!hit.length) return
          hit.forEach((idx) => {
            const col = colRefs.current[idx]
            if (col) col.style.setProperty('--pl', '1')
          })
          setView((prev) => {
            const shown = [...prev.shown]
            const lit = [...prev.lit]
            hit.forEach((idx) => {
              shown[idx] = true
              lit[idx] = CELEBRATIONS[idx].items.length
            })
            return { shown, lit }
          })
        },
        { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
      )

      colRefs.current.forEach((el) => {
        if (el) io.observe(el)
      })
      return () => io.disconnect()
    }

    const sec = secRef.current
    const single = CELEBRATIONS.length === 1
    let ps = still ? 1 : 0 // smoothed progress
    let pt = ps // target progress
    let raf = 0
    let lastKey = ''

    function apply() {
      const next = { shown: [], lit: [] }
      CELEBRATIONS.forEach((c, i) => {
        const st = STEPS[i] || STEPS[STEPS.length - 1]
        const pl = clamp((ps - st.thread[0]) / (st.thread[1] - st.thread[0]))
        const col = colRefs.current[i]
        if (col) col.style.setProperty('--pl', pl.toFixed(4))
        next.shown.push(ps >= st.appear)
        next.lit.push(litCount(pl, c.items.length))
      })
      /* re-render only when something visible actually changes */
      const key = JSON.stringify(next)
      if (key !== lastKey) {
        lastKey = key
        setView(next)
      }
    }

    function draw() {
      ps += (pt - ps) * 0.12
      if (Math.abs(pt - ps) < 0.0005) ps = pt
      apply()
      raf = ps !== pt ? requestAnimationFrame(draw) : 0
    }

    function measure() {
      if (still) pt = 1
      else {
        /* starts a little before the section pins, ends when it unpins */
        const r = sec.getBoundingClientRect()
        if (single) {
          pt = clamp((window.innerHeight - r.top) / window.innerHeight)
          if (!raf) raf = requestAnimationFrame(draw)
          return
        }
        const lead = window.innerHeight * 0.2
        const span = r.height - window.innerHeight
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
        'sec s-pearl cel' +
        (CELEBRATIONS.length === 1 ? ' is-single' : '') +
        (IS_MULTI ? ' is-multi' : '') +
        (still ? ' is-still' : '')
      }
      data-block="plan"
      data-block-name="4 · Программа: помолвка и свадьба"
    >
      <span className="lace lace--top" aria-hidden="true" />
      <div className="cel__stage">
        <div className="wrap">
          <Reveal as="h2" className="t" style={{ color: 'var(--ruby)' }}>
            Celebrations
          </Reveal>
          <Reveal as="p" className="sub">
            How the days will unfold
          </Reveal>

          <div className="cel__row">
            {CELEBRATIONS.map((c, i) => (
              <article
                key={c.name}
                data-cel-idx={i}
                ref={(el) => {
                  colRefs.current[i] = el
                }}
                className={'cel__col cel__col--' + (i % 2 ? 'r' : 'l') + (view.shown[i] ? ' is-in' : '')}
              >
                <header className="cel__head">
                  <h3 className="cel__name">{c.name}</h3>
                  <p className="cel__date">
                    <span>{c.weekday}</span>
                    {c.date}
                  </p>
                </header>
                <div className="cel__tl">
                  <span className="cel__line" aria-hidden="true">
                    <i />
                  </span>
                  <ol>
                    {c.items.map((it, k) => (
                      <li
                        key={it.time + it.title}
                        className={k < view.lit[i] ? 'is-lit' : undefined}
                        style={IS_MULTI ? { '--d': `${180 + k * 140}ms` } : undefined}
                      >
                        <div className="cel__tx">
                          <b>{it.title}</b>
                          {it.time && <time>{it.time}</time>}
                          <span>{it.text}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
          </div>

          {CELEBRATION_NOTE && (
            <Reveal as="aside" className="cel__note" aria-label={CELEBRATION_NOTE.title}>
              <h3>{CELEBRATION_NOTE.title}</h3>
              <p>{CELEBRATION_NOTE.text}</p>
            </Reveal>
          )}
        </div>
      </div>
      <span className="lace lace--bot" aria-hidden="true" />
    </section>
  )
}
