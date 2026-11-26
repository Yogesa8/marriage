import { useEffect, useRef, useState } from 'react'
import { COUPLE } from '../data/invite'
import { addToCalendar } from '../utils/calendar'
import { asset, buzz, clamp, prefersReducedMotion } from '../utils/helpers'
import { OCCASION_EVENT as EVENT } from '../utils/occasion'
import { NAMES } from '../utils/variant'
import Reveal from './Reveal'

/* 3 · Desk flip calendar: scrolling turns the months up to the wedding month, then the date gets circled */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const W0 = new Date(EVENT.start)
const WY = W0.getFullYear()
const WM = W0.getMonth()
const WD = W0.getDate()

/* Show only December, January and the February wedding month. */
const PAGES = []
for (let k = 2; k >= 0; k--) {
  const d = new Date(WY, WM - k, 1)
  PAGES.push([d.getFullYear(), d.getMonth()])
}
const N = PAGES.length

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

function MonthGrid({ y, m }) {
  const lead = (new Date(y, m, 1).getDay() + 6) % 7
  const n = new Date(y, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < lead; i++) cells.push(<span key={'e' + i} />)
  for (let d = 1; d <= n; d++) {
    const wkd = (lead + d - 1) % 7
    const me = y === WY && m === WM && d === WD
    cells.push(
      <span key={d} className={me ? 'day' : wkd > 4 ? 'is-we' : undefined}>
        {d}
        {me && (
          <svg className="ring" viewBox="0 0 100 80">
            <path pathLength="1" d="M60 10C38 4 12 14 10 38s22 36 46 34 38-16 34-36S66 2 40 12" />
          </svg>
        )}
      </span>,
    )
  }
  return (
    <div className="pg__g">
      {WEEKDAYS.map((w, i) => (
        <b key={'w' + i}>{w}</b>
      ))}
      {cells}
    </div>
  )
}

export default function Calendar({ sectionRef }) {
  const pageRefs = useRef([])
  const faceRefs = useRef([])
  const [landed, setLanded] = useState(false)

  useEffect(() => {
    const dsec = sectionRef.current
    const still = prefersReducedMotion()
    let isLanded = false
    let raf = 0

    function calTick() {
      const r = dsec.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const p = still ? 1 : clamp(-r.top / Math.max(1, span))
      const flips = N - 1
      const f = clamp(p / 0.8) * flips
      pageRefs.current.forEach((pg, i) => {
        if (!pg || i >= flips) return
        const l = ease(clamp(f - i))
        pg.style.setProperty('--a', (-l * 178).toFixed(2))
        pg.style.setProperty('--o', l > 0.42 ? Math.max(0, 1 - (l - 0.42) / 0.2).toFixed(3) : 1)
        pg.style.visibility = l > 0.62 ? 'hidden' : ''
        const nx = faceRefs.current[i + 1]
        if (nx) nx.style.setProperty('--sh', (Math.sin(l * Math.PI) * 0.3).toFixed(3))
      })
      const L = p > 0.84
      if (L !== isLanded) {
        isLanded = L
        setLanded(L)
        if (L) buzz(20)
      }
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        calTick()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', calTick)
    calTick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', calTick)
    }
  }, [sectionRef])

  return (
    <section
      ref={sectionRef}
      className="sec s-velvet dsec"
      id="date"
      data-block="calendar"
      data-block-name="3 · Перекидной календарь"
      style={{ '--n': N - 1 }}
    >
      <div className={'dstage' + (landed ? ' is-landed' : '')} id="dstage">
        <Reveal as="h2" className="t">
          Save the date
        </Reveal>
        <Reveal as="p" className="sub">
          Turn the pages to our day
        </Reveal>
        <div
          className={'desk' + (landed ? ' is-landed' : '')}
          id="desk"
          role="img"
          aria-label={`Calendar for ${MONTHS[WM]} ${WY} with ${EVENT.dateLong || COUPLE.dateLong} circled`}
        >
          <div className="desk__board" />
          <div id="pages">
            {PAGES.map(([y, m], i) => (
              <div
                key={`${y}-${m}`}
                className="pg"
                style={{ zIndex: 50 - i }}
                ref={(el) => {
                  pageRefs.current[i] = el
                }}
              >
                <div
                  className="pg__f"
                  ref={(el) => {
                    faceRefs.current[i] = el
                  }}
                >
                  <p className="pg__m">{MONTHS[m]}</p>
                  <p className="pg__y">{y}</p>
                  <MonthGrid y={y} m={m} />
                </div>
                <div className="pg__b" />
              </div>
            ))}
          </div>
          <div className="desk__head" aria-hidden="true">
            {NAMES.monogram}
          </div>
          <img className="desk__pearls" src={asset('assets/media/pearls-strand.webp')} alt="" aria-hidden="true" />
        </div>
        <div className="dinfo">
          <p className="dinfo__d">
            <b>{EVENT.dateLong || COUPLE.dateLong}</b>
            {EVENT.dateNote || COUPLE.dateNote}
          </p>
          <button className="btn btn--gold" id="calAdd" type="button" onClick={() => addToCalendar(EVENT)}>
            Add to my calendar
          </button>
        </div>
      </div>
    </section>
  )
}
