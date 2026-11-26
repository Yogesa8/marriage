import { useEffect, useRef } from 'react'
import { asset, hasIO, prefersReducedMotion } from '../utils/helpers'
import { NAMES, VARIANT_CFG } from '../utils/variant'

/* 2 · Letter: a bordeaux lace envelope, the letter rises out of its pocket on scroll */
export default function Letter({ guest }) {
  const envRef = useRef(null)
  const noteRef = useRef(null)

  useEffect(() => {
    const env = envRef.current
    const note = noteRef.current
    let risen = false
    let disposed = false
    let raf = 0
    let io = null

    /* leave room above for the risen letter; the bottom of the letter always stays in the pocket behind the front flaps */
    function envLayout() {
      if (disposed) return
      const eh = env.offsetHeight
      const nh = note.offsetHeight
      const top = eh * 0.12
      const lift = Math.max(0, top + nh - eh * 0.56)
      env.style.marginTop = Math.max(0, lift - top + 40) + 'px'
      note.style.setProperty('--rise', (risen ? -lift : 0) + 'px')
      if (!risen) note.style.setProperty('--cut', Math.max(0, top + nh - eh + 16) + 'px')
    }

    /* while the letter moves, its bottom edge is clipped at the envelope edge */
    function rise() {
      if (risen) return
      risen = true
      envLayout()
      const t0 = performance.now()
      const loop = (n) => {
        if (disposed) return
        const er = env.getBoundingClientRect()
        const nr = note.getBoundingClientRect()
        note.style.setProperty('--cut', Math.max(0, nr.bottom - er.bottom + 16) + 'px')
        if (n - t0 < 2800) raf = requestAnimationFrame(loop)
      }
      loop(t0)
    }

    envLayout()
    window.addEventListener('resize', envLayout)
    if (document.fonts) document.fonts.ready.then(envLayout)

    if (prefersReducedMotion() || !hasIO()) rise()
    else {
      io = new IntersectionObserver(
        (es) => {
          if (es[0].isIntersecting) {
            rise()
            io.disconnect()
          }
        },
        { threshold: 0.6 },
      )
      io.observe(env)
    }

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', envLayout)
      if (io) io.disconnect()
    }
  }, [])

  return (
    <section
      className="sec s-silk letter"
      id="letter"
      data-block="letter"
      data-block-name="2 · Письмо из конверта"
    >
      <div className="wrap">
        <div className="env" id="env" ref={envRef} aria-label={VARIANT_CFG.letter}>
          <div className="env__back" />
          <article className="note" id="note" ref={noteRef}>
            <img className="note__pin" src={asset('assets/media/pearl-pin.webp')} alt="" aria-hidden="true" />
            <span className="note__hole" aria-hidden="true" />
            <h2 id="dear">{guest ? `Dear ${guest}` : 'Dear family & friends'}</h2>
            <p className="letter__txt" data-otl-message="" dir="auto">
              {VARIANT_CFG.letter}
            </p>
            <p className="letter__sig">
              {NAMES.first} & {NAMES.second}
            </p>
          </article>
          <div className="env__front" />
        </div>
      </div>
    </section>
  )
}
