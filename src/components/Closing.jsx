import { useEffect, useState } from 'react'
import { COUPLE, EVENT } from '../data/invite'
import Reveal from './Reveal'

const T_EVENT = new Date(EVENT.start + (EVENT.utcOffset || '')).getTime()
const T_END = new Date(EVENT.end + (EVENT.utcOffset || '')).getTime()
const pad = (n) => String(n).padStart(2, '0')

function timeLeft() {
  const s = Math.max(0, Math.floor((T_EVENT - Date.now()) / 1000))
  return {
    done: s === 0,
    over: Date.now() > T_END,
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

const UNITS = [
  ['d', 'days'],
  ['h', 'hours'],
  ['m', 'minutes'],
  ['s', 'seconds'],
]

/* 10 · Until we meet: a live countdown over the velvet-curtain stage */
export default function Closing() {
  const [left, setLeft] = useState(timeLeft)

  useEffect(() => {
    if (left.over) return
    /* tick on the start of every second so the digits change in step with the clock */
    let id = 0
    const tick = () => {
      setLeft(timeLeft())
      id = setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    id = setTimeout(tick, 1000 - (Date.now() % 1000))
    return () => clearTimeout(id)
  }, [left.over])

  return (
    <section className="sec closing" data-block="end" data-block-name="10 · До встречи">
      <div className="wrap">
        <Reveal as="h2" className="t">
          Until we meet
        </Reveal>
        {left.done ? (
          <Reveal as="p" className="cd-done">
            {left.over ? 'Thank you for celebrating with us' : 'Today is the day'}
          </Reveal>
        ) : (
          <Reveal className="cd" role="timer" aria-label="Time until the wedding">
            {UNITS.map(([k, label], i) => (
              <div className="cd__u" key={k}>
                {i > 0 && <i aria-hidden="true">:</i>}
                <div>
                  <b data-cd={k}>{k === 'd' ? left.d : pad(left[k])}</b>
                  <span>{label}</span>
                </div>
              </div>
            ))}
          </Reveal>
        )}
        <Reveal className="love">
          <p>With love,</p>
          <p className="s">
            {COUPLE.first}
            <em>&</em>
            {COUPLE.second}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
