import { useEffect, useRef } from 'react'
import { asset, clamp, prefersReducedMotion } from '../utils/helpers'

/*
 * Perspective tunnel: image cards fly from far away towards the guest while the page scrolls.
 *
 * JavaScript does one job only: it measures scroll and pointer position and writes them as
 * CSS custom properties (--progress, --px, --py) on the section. Every transform and opacity
 * is computed in perspective-tunnel.css from those variables.
 */

/* placeholder images already in the project: swap them for the couple's own photos later */
const DEFAULT_IMAGES = [
  { src: asset('assets/media/img1.jpeg'), title: 'The first dance', alt: 'The couple dancing on a stage in a beam of light' },
  { src: asset('assets/media/img2.jpeg'), title: 'The long table', alt: 'A long candlelit dinner table set outdoors' },
  { src: asset('assets/media/img3.jpeg'), title: 'A little sparkle', alt: 'A wall of red glitter catching the light' },
  { src: asset('assets/media/img4.jpeg'), title: 'Curtain up', alt: 'A red velvet curtain on a softly lit stage' },
  { src: asset('assets/media/img5.jpeg'), title: 'Pearls & ivory', alt: 'Ivory silk trimmed with pearls' },
  { src: asset('assets/media/img6.jpeg'), title: 'Bordeaux silk', alt: 'Folds of deep bordeaux satin' },
  { src: asset('assets/media/img7.jpeg'), title: 'Ruby sequins', alt: 'Close-up of shimmering ruby sequins' },
  // { src: asset('assets/media/velvet.jpg'), title: 'Velvet nights', alt: 'Soft red velvet texture' },
  // { src: asset('assets/media/emboss.jpg'), title: 'Our promise', alt: 'Embossed ivory paper with a floral pattern' },
]

const GOLDEN_ANGLE = 137.5
const WINDOW = 0.45 // spread of card start times across the scroll
const SPAN = 0.55 // how long each card's flight lasts

/* fixed per-card placement, in viewport units so no resize handler is needed */
function cardVars(i, count) {
  const a = (i * GOLDEN_ANGLE * Math.PI) / 180
  const x = Math.cos(a) * 100 * (0.28 + (i % 3) * 0.08)
  const y = Math.sin(a) * 100 * (0.26 + (i % 2) * 0.09)
  const rot = (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2)
  return {
    '--x': `${x.toFixed(2)}vw`,
    '--y': `${y.toFixed(2)}svh`,
    '--rot': `${rot}deg`,
    '--start': ((i / count) * WINDOW).toFixed(4),
    '--span': SPAN,
    zIndex: i + 1,
  }
}

export default function PerspectiveTunnel({ images = DEFAULT_IMAGES }) {
  const secRef = useRef(null)

  useEffect(() => {
    const sec = secRef.current
    const still = prefersReducedMotion()

    let target = 0 // real scroll progress
    let shown = 0 // smoothed progress written to CSS
    let tpx = 0
    let tpy = 0
    let px = 0
    let py = 0
    let near = false
    let raf = 0

    const measure = () => {
      const r = sec.getBoundingClientRect()
      target = clamp(-r.top / Math.max(1, r.height - window.innerHeight))
    }

    const write = () => {
      sec.style.setProperty('--progress', shown.toFixed(4))
      sec.style.setProperty('--px', px.toFixed(4))
      sec.style.setProperty('--py', py.toFixed(4))
    }

    /* one loop: eases progress and pointer towards their targets; stops when settled or far away */
    const loop = () => {
      measure()
      if (still) {
        shown = target
      } else {
        shown += (target - shown) * 0.1
        px += (tpx - px) * 0.08
        py += (tpy - py) * 0.08
        if (Math.abs(target - shown) < 0.0005) shown = target
        if (Math.abs(tpx - px) < 0.0005) px = tpx
        if (Math.abs(tpy - py) < 0.0005) py = tpy
      }
      write()
      const settled = shown === target && px === tpx && py === tpy
      raf = near && !settled ? requestAnimationFrame(loop) : 0
    }

    const kick = () => {
      if (near && !raf) raf = requestAnimationFrame(loop)
    }

    /* camera parallax follows the mouse only (touch scrolling would make it jitter) */
    const onPointer = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      tpx = (e.clientX / window.innerWidth) * 2 - 1
      tpy = (e.clientY / window.innerHeight) * 2 - 1
      kick()
    }

    const io = new IntersectionObserver(
      (entries) => {
        near = entries[entries.length - 1].isIntersecting
        if (near) kick()
      },
      { rootMargin: '25% 0px' },
    )
    io.observe(sec)

    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick)
    if (!still) window.addEventListener('pointermove', onPointer, { passive: true })

    measure()
    shown = target
    write()

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  return (
    <section ref={secRef} className="tunnel-section" data-block="moments" aria-label="Our story in moments">
      <div className="tunnel-section__stage">
        <div className="tunnel-section__grid" aria-hidden="true" />
        <div className="tunnel-section__glow" aria-hidden="true" />
        <div className="tunnel-section__ring tunnel-section__ring--inner" aria-hidden="true" />
        <div className="tunnel-section__ring tunnel-section__ring--outer" aria-hidden="true" />

        <div className="tunnel-section__space">
          <div className="tunnel-section__text">
            <p className="tunnel-section__label">Our story in moments</p>
            <h2 className="tunnel-section__title">
              <span>Every moment</span>
              <span>led us here</span>
            </h2>
            <p className="tunnel-section__desc">From the first hello to forever: a few glimpses of the love we can’t wait to celebrate with you.</p>
          </div>

          {images.map((img, i) => (
            <figure key={img.src + i} className="tunnel-section__card" style={cardVars(i, images.length)}>
              <img
                className="tunnel-section__img"
                src={img.src}
                alt={img.alt || img.title}
                loading="lazy"
                draggable="false"
              />
              {/* <figcaption className="tunnel-section__caption">{img.title}</figcaption> */}
            </figure>
          ))}
        </div>

        <div className="tunnel-section__hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <i />
        </div>
      </div>
    </section>
  )
}
