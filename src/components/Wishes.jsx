import { WISHES } from '../data/invite'
import Reveal from './Reveal'

/* 7 · A few wishes: paper cards */
export default function Wishes() {
  return (
    <section className="sec s-pearl" data-block="details" data-block-name="7 · Пожелания">
      <span className="lace lace--top" aria-hidden="true" />
      <div className="wrap">
        <Reveal as="h2" className="t" style={{ color: 'var(--ruby)' }}>
          A few wishes
        </Reveal>
        <div className="wish">
          {WISHES.map((w) => (
            <Reveal as="article" className="wcard" key={w.title}>
              <h3>{w.title}</h3>
              <p data-otl-detail="" dir="auto">
                {w.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
      <span className="lace lace--bot" aria-hidden="true" />
    </section>
  )
}
