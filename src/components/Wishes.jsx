import { WISHES } from '../data/invite'
import { OCCASION_EVENT } from '../utils/occasion'
import Reveal from './Reveal'

function renderPhoneLinks(phoneStr) {
  return phoneStr.split(' / ').map((phone, i) => (
    <span key={phone}>
      {i > 0 && ' / '}
      <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
    </span>
  ))
}

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
                {w.title === 'Contact' && OCCASION_EVENT.phone
                  ? renderPhoneLinks(OCCASION_EVENT.phone)
                  : w.text}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
      <span className="lace lace--bot" aria-hidden="true" />
    </section>
  )
}
