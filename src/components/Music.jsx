import { useEffect, useRef, useState } from 'react'

const VOLUME = 0.55
const FADE_MS = 2500

/*
 * Background music with a small floating sound button.
 *
 * apiRef receives:
 *  unlock() — call inside a user click (the splash). Phones only allow audio that was
 *             first started by a tap, so the track is played silently for a moment and paused.
 *  start()  — start the music with a soft fade-in when the glitter falls away.
 *
 * If `src` is empty or the file is missing, nothing is shown and nothing breaks.
 */
export default function Music({ src, apiRef }) {
  const audioRef = useRef(null)
  /* the guest wants music on (started and not muted with the button) */
  const wanted = useRef(false)
  const [state, setState] = useState('idle') // idle | playing | paused | error

  useEffect(() => {
    const a = audioRef.current
    if (!a) {
      if (apiRef) apiRef.current = { unlock() {}, start() {} }
      return
    }
    let unlocked = false
    let started = false
    let failed = false
    let fadeRaf = 0
    let resumeOnShow = false

    const fadeIn = () => {
      cancelAnimationFrame(fadeRaf)
      a.volume = 0
      const t0 = performance.now()
      const step = (now) => {
        /* the first frame time can be slightly earlier than t0: keep the volume inside 0..1 */
        const k = Math.max(0, Math.min(1, (now - t0) / FADE_MS))
        a.volume = VOLUME * k
        if (k < 1) fadeRaf = requestAnimationFrame(step)
      }
      fadeRaf = requestAnimationFrame(step)
    }

    const play = () => {
      const p = a.play()
      if (p && p.then) {
        p.then(
          () => setState('playing'),
          () => {
            /* blocked by the browser: the button lets the guest start it by hand */
            if (!failed) setState('paused')
          },
        )
      } else setState('playing')
    }

    const onError = () => {
      failed = true
      wanted.current = false
      setState('error')
    }

    /* pause when the guest leaves the tab / locks the phone, resume when they come back */
    const onVisibility = () => {
      if (document.hidden) {
        if (!a.paused) {
          a.pause()
          resumeOnShow = true
        }
      } else if (resumeOnShow) {
        resumeOnShow = false
        if (wanted.current) play()
      }
    }

    a.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisibility)

    if (apiRef) {
      apiRef.current = {
        unlock() {
          if (unlocked || failed) return
          unlocked = true
          a.muted = true
          const p = a.play()
          const done = () => {
            if (!started) {
              a.pause()
              try {
                a.currentTime = 0
              } catch {
                /* ignore */
              }
            }
            a.muted = false
          }
          if (p && p.then) p.then(done, () => (a.muted = false))
          else done()
        },
        start() {
          if (started || failed) return
          started = true
          wanted.current = true
          a.muted = false
          fadeIn()
          play()
        },
      }
    }

    return () => {
      cancelAnimationFrame(fadeRaf)
      a.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisibility)
      a.pause()
      if (apiRef) apiRef.current = null
    }
  }, [apiRef, src])

  if (!src) return null

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) {
      wanted.current = true
      a.volume = VOLUME
      const p = a.play()
      if (p && p.then) p.then(() => setState('playing'), () => setState('paused'))
      else setState('playing')
    } else {
      wanted.current = false
      a.pause()
      setState('paused')
    }
  }

  const on = state === 'playing'
  const visible = state === 'playing' || state === 'paused'

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="metadata" />
      <button
        type="button"
        className={'sound' + (visible ? ' is-on' : '')}
        aria-label={on ? 'Mute the music' : 'Play the music'}
        aria-pressed={on}
        onClick={toggle}
        tabIndex={visible ? 0 : -1}
        aria-hidden={visible ? undefined : true}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
          {on ? (
            <>
              <path className="sound__wave" d="M15.5 9a4.2 4.2 0 0 1 0 6" />
              <path className="sound__wave sound__wave--2" d="M18 6.6a7.6 7.6 0 0 1 0 10.8" />
            </>
          ) : (
            <path d="M16 9.5l5 5M21 9.5l-5 5" />
          )}
        </svg>
      </button>
    </>
  )
}
