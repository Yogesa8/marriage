import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { COUPLE, EVENT, INVITE_NAMED_OPENING } from '../data/invite'
import { asset, buzz } from '../utils/helpers'

/*
 * 0 · Intro: a wall of red glitter. The guest taps,
 * the glitter falls away, the curtain opens and the couple dances.
 */

const VID = asset('assets/media/film-ruby2.mp4')
const VID_META = asset('assets/media/film-ruby2.json')
const FIRST_FRAME = asset('assets/media/film-ruby-first.jpg')
const LAST_FRAME = asset('assets/media/film-ruby-last.jpg')

const DEBUG_STYLE = {
  position: 'fixed',
  left: 6,
  right: 6,
  top: 6,
  zIndex: 999,
  margin: 0,
  padding: '6px 8px',
  background: 'rgba(0,0,0,.78)',
  color: '#9f9',
  font: '11px/1.35 monospace',
  whiteSpace: 'pre-wrap',
  pointerEvents: 'none',
}

const INITIAL_FX = { go: false, playing: false, seq: false, still: false, names: false }

/*
 * Props:
 *  apiRef     — receives { activate() }: call it when the splash opens
 *  onReady    — the video has buffered enough (or the wait timed out): the splash can be opened
 *  onProgress — video buffering progress 0..1 for the splash loading line
 *  onOpen     — the glitter starts falling after a tap or auto-open
 *  onNamed    — the names appeared: the intro is over and the page unlocks
 */
const READY_TIMEOUT = 8000

export default function Intro({ apiRef, guest, onOpen, onNamed, onReady, onProgress }) {
  const filmRef = useRef(null)
  const canvasRef = useRef(null)
  const debugRef = useRef(null)
  /* controls created inside the effect: open(byTap), isOpened() */
  const ctl = useRef(null)
  const cbs = useRef({ onOpen, onNamed, onReady, onProgress })

  const [fx, setFx] = useState(INITIAL_FX)
  /* diagnostics for testing on a phone: ?debug=1 */
  const [debug] = useState(() => !!new URLSearchParams(window.location.search).get('debug'))

  useEffect(() => {
    cbs.current = { onOpen, onNamed, onReady, onProgress }
  }, [onOpen, onNamed, onReady, onProgress])

  useEffect(() => {
    const film = filmRef.current
    const cv = canvasRef.current

    let disposed = false
    const timers = new Set()
    const later = (fn, ms) => {
      const id = setTimeout(() => {
        timers.delete(id)
        if (!disposed) fn()
      }, ms)
      timers.add(id)
      return id
    }
    const flag = (...names) =>
      setFx((s) => {
        const n = { ...s }
        names.forEach((k) => {
          n[k] = true
        })
        return n
      })

    const DBG = { play: '', anim: '', err: '' }

    /* false while the splash screen is still covering the intro */
    let active = false
    let activeAt = 0
    let splashReady = false
    let opened = false
    let named = false
    let vidReady = false
    let mode = ''
    let autoOK = null
    let seqStarted = false
    let DEC = null
    let decoder = null

    let autoT = 0

    /* ===== video ===== */
    film.muted = true
    film.defaultMuted = true
    film.setAttribute('muted', '')
    film.src = VID
    try {
      film.load()
    } catch {
      /* ignore */
    }

    /* the splash screen waits for this before it can be opened */
    function markReady() {
      if (splashReady || disposed) return
      splashReady = true
      if (cbs.current.onProgress) cbs.current.onProgress(1)
      if (cbs.current.onReady) cbs.current.onReady()
    }
    const onProgressEvt = () => {
      const d = film.duration
      if (!isFinite(d) || d <= 0 || !film.buffered.length) return
      const end = film.buffered.end(film.buffered.length - 1)
      if (cbs.current.onProgress) cbs.current.onProgress(Math.min(1, end / d))
    }

    const onCanPlay = () => {
      markReady()
      if (!vidReady) {
        vidReady = true
        plan()
      }
    }
    const onPlaying = () => {
      if (mode === 'video') flag('playing')
    }
    const onTime = () => {
      if (mode === 'video' && film.currentTime >= EVENT.namesAt) showNames()
    }
    const onEnded = () => {
      if (mode === 'video') showNames()
    }
    const onVideoError = () => {
      markReady()
      if (opened && mode === 'video') playDecoded()
    }
    film.addEventListener('canplaythrough', onCanPlay)
    film.addEventListener('progress', onProgressEvt)
    film.addEventListener('playing', onPlaying)
    film.addEventListener('timeupdate', onTime)
    film.addEventListener('ended', onEnded)
    film.addEventListener('error', onVideoError)

    /* warm-up: start and immediately stop the muted video. This way the iPhone downloads it
       in advance and we learn whether the phone allows playback without a tap (it doesn't in low-power mode) */
    try {
      const wp = film.play()
      if (wp && wp.then) {
        wp.then(
          () => {
            if (disposed) return
            autoOK = true
            if (!opened) {
              film.pause()
              try {
                film.currentTime = 0
              } catch {
                /* ignore */
              }
            }
            vidReady = true
            plan()
          },
          (e) => {
            if (disposed) return
            if (e && e.name === 'NotAllowedError') {
              autoOK = false
              /* low-power mode: the decoded fallback downloads the whole clip, ready once it is in */
              const p = prepDecode()
              if (p) p.then(markReady, markReady)
              else markReady()
              vidReady = true
              plan()
            }
          },
        )
      }
    } catch {
      /* ignore */
    }

    /* ===== fallback for opening by breath without a tap: the clip is decoded by the phone's
       video decoder and the frames are drawn onto a canvas at full quality. This is not video playback,
       so low-power mode does not block it ===== */
    function prepDecode() {
      if (INVITE_NAMED_OPENING) return null
      if (DEC || !window.VideoDecoder || !window.fetch) return DEC
      DEC = Promise.all([fetch(VID).then((r) => r.arrayBuffer()), fetch(VID_META).then((r) => r.json())]).then(
        ([data, m]) => {
          const d = atob(m.desc)
          const desc = new Uint8Array(d.length)
          for (let i = 0; i < d.length; i++) desc[i] = d.charCodeAt(i)
          const cfg = { codec: m.codec, codedWidth: m.w, codedHeight: m.h, description: desc }
          return window.VideoDecoder.isConfigSupported(cfg).then((r) => {
            if (!r.supported) throw new Error('codec not supported')
            return { buf: new Uint8Array(data), m, cfg }
          })
        },
      )
      DEC.catch(() => {})
      return DEC
    }

    function playDecoded() {
      if (mode === 'dec' || named) return
      mode = 'dec'
      try {
        film.pause()
      } catch {
        /* ignore */
      }
      DBG.play += ' >dec'
      const p = prepDecode()
      if (!p) {
        stillEnd()
        return
      }
      p.then(
        (D) => {
          if (named || disposed) return
          const r = cv.getBoundingClientRect()
          const dpr = Math.min(2, window.devicePixelRatio || 1)
          const W = (cv.width = Math.round(r.width * dpr))
          const Hc = (cv.height = Math.round(r.height * dpr))
          const g = cv.getContext('2d')
          const sc = Math.max(W / D.m.w, Hc / D.m.h)
          const dw = D.m.w * sc
          const dh = D.m.h * sc
          const dx = (W - dw) / 2
          const dy = (Hc - dh) / 2
          const F = D.m.f
          const q = []
          const lastTs = F[F.length - 1][2]
          let i = 0
          let t0 = 0
          let done = false
          const dec = (decoder = new window.VideoDecoder({
            output: (fr) => {
              if (disposed) fr.close()
              else q.push(fr)
            },
            error: () => {
              if (!done) {
                done = true
                stillEnd()
              }
            },
          }))
          dec.configure(D.cfg)
          const feed = () => {
            while (i < F.length && q.length + dec.decodeQueueSize < 12) {
              const f = F[i++]
              dec.decode(
                new window.EncodedVideoChunk({
                  type: f[3] ? 'key' : 'delta',
                  timestamp: f[2],
                  data: D.buf.subarray(f[0], f[0] + f[1]),
                }),
              )
            }
            if (i >= F.length) dec.flush().catch(() => {})
          }
          feed()
          const step = (now) => {
            if (done || disposed) return
            if (!t0 && q.length) {
              t0 = now
              seqStarted = true
              flag('seq', 'playing')
              DBG.anim = 'decoding'
            }
            if (t0) {
              const t = (now - t0) * 1000
              let fr = null
              while (q.length && q[0].timestamp <= t) {
                if (fr) fr.close()
                fr = q.shift()
              }
              if (fr) {
                g.drawImage(fr, dx, dy, dw, dh)
                fr.close()
              }
              if (t >= EVENT.namesAt * 1e6) showNames()
              if (t > lastTs + 40000 && i >= F.length && !q.length) {
                done = true
                flag('still')
                showNames()
                try {
                  dec.close()
                } catch {
                  /* ignore */
                }
                return
              }
            }
            feed()
            requestAnimationFrame(step)
          }
          step(performance.now())
        },
        () => stillEnd(),
      )
      later(() => {
        if (!named && !seqStarted) stillEnd()
      }, 9000)
    }

    /* open: a tap always starts the video; a breath or auto-start start the video
       if the phone allows it, otherwise the decoded playback */
    function open(byTap) {
      if (opened) return
      opened = true
      clearTimeout(autoT)
      buzz([20, 30, 40])
      flag('go')
      if (cbs.current.onOpen) cbs.current.onOpen()
      if (!byTap && autoOK === false) {
        playDecoded()
        return
      }
      mode = 'video'
      try {
        film.currentTime = 0
      } catch {
        /* ignore */
      }
      const fail = (e) => {
        if (disposed) return
        DBG.play = 'rejected ' + (e && e.name)
        if (byTap) stillEnd()
        else playDecoded()
      }
      try {
        const p = film.play()
        if (p && p.then)
          p.then(() => {
            DBG.play = 'ok'
          }, fail)
      } catch (e) {
        fail(e)
      }
      /* the video never moved: without a tap switch to decoded playback, after a tap show the last frame */
      later(() => {
        if (mode === 'video' && !named && film.currentTime < 0.05) {
          if (byTap) return
          try {
            film.pause()
          } catch {
            /* ignore */
          }
          playDecoded()
        }
      }, 4000)
      later(() => {
        if (mode === 'video' && !named && film.currentTime < 0.3) stillEnd()
      }, 10000)
    }

    function stillEnd() {
      if (named) return
      try {
        film.pause()
      } catch {
        /* ignore */
      }
      flag('still', 'playing')
      showNames()
    }

    function showNames() {
      if (named) return
      named = true
      flag('names')
      if (cbs.current.onNamed) cbs.current.onNamed()
    }

    /* Auto-open if the visitor does not tap after opening the splash. */
    function plan() {
      if (!active || opened || !vidReady || disposed) return
      clearTimeout(autoT)
      autoT = later(() => open(false), 3000)
    }

    ctl.current = {
      open,
      isOpened: () => opened,
      /* the splash is still fading out for ~2 s: a second tap on it must not skip the glitter */
      canTap: () => active && performance.now() - activeAt > 1900,
    }

    /* The splash was opened: enable the tap interaction and fallback timer. */
    function activate() {
      if (active || disposed) return
      active = true
      activeAt = performance.now()
      plan()
    }
    if (apiRef) apiRef.current = { activate }

    /* the video never reported it was ready: plan the auto-start anyway */
    later(() => {
      if (!vidReady) {
        vidReady = true
        plan()
      }
    }, 6000)
    /* never keep the guest on the splash for too long on a slow connection */
    later(markReady, READY_TIMEOUT)

    /* ===== diagnostics ===== */
    const onWindowError = (e) => {
      DBG.err = String(e.message).slice(0, 60)
    }
    window.addEventListener('error', onWindowError)
    let dbgTimer = 0
    if (debug) {
      dbgTimer = setInterval(() => {
        const el = debugRef.current
        if (!el) return
        el.textContent =
          'auto=' + autoOK + ' dec=' + !!window.VideoDecoder + ' video ready=' + vidReady +
          ' paused=' + film.paused + ' t=' + film.currentTime.toFixed(2) + ' play=' + DBG.play +
          '\nanim ' + DBG.anim + ' mode=' + mode + ' opened=' + opened + ' names=' + named +
          (DBG.err ? '\nerr ' + DBG.err : '') + '\n' + navigator.userAgent.slice(0, 110)
      }, 200)
    }

    return () => {
      disposed = true
      timers.forEach(clearTimeout)
      timers.clear()
      clearTimeout(autoT)
      clearInterval(dbgTimer)
      try {
        if (decoder && decoder.state !== 'closed') decoder.close()
      } catch {
        /* ignore */
      }
      try {
        film.pause()
      } catch {
        /* ignore */
      }
      film.removeEventListener('canplaythrough', onCanPlay)
      film.removeEventListener('progress', onProgressEvt)
      film.removeEventListener('playing', onPlaying)
      film.removeEventListener('timeupdate', onTime)
      film.removeEventListener('ended', onEnded)
      film.removeEventListener('error', onVideoError)
      window.removeEventListener('error', onWindowError)
      ctl.current = null
      if (apiRef) apiRef.current = null
    }
  }, [debug, apiRef])

  const tapOpen = () => {
    const c = ctl.current
    if (!c || c.isOpened() || !c.canTap()) return
    c.open(true)
  }

  const onKeyDown = (e) => {
    const c = ctl.current
    if (c && !c.isOpened() && c.canTap() && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      c.open(true)
    }
  }

  const className = [
    'intro',
    fx.go && 'is-go',
    fx.playing && 'is-playing',
    fx.seq && 'is-seq',
    fx.still && 'is-still',
    fx.names && 'is-names',
  ]
    .filter(Boolean)
    .join(' ')

  const names = `${COUPLE.first} & ${COUPLE.second}`

  return (
    <header
      className={className}
      id="intro"
      role={fx.go ? undefined : 'button'}
      tabIndex={fx.go ? undefined : 0}
      aria-label={
        fx.go ? names : `A wall of red glitter. Tap to open the invitation from ${names}`
      }
      data-block="intro"
      data-block-name="0 · Заставка: блестки"
      onClick={tapOpen}
      onTouchEnd={tapOpen}
      onKeyDown={onKeyDown}
    >
      <img className="intro__blur" src={FIRST_FRAME} alt="" aria-hidden="true" />
      <div className="intro__box">
        <video
          ref={filmRef}
          className="intro__v"
          id="film"
          poster={FIRST_FRAME}
          muted
          playsInline
          webkit-playsinline=""
          preload="auto"
          disablePictureInPicture
          aria-label={`Red glitter falls away, the velvet curtain opens and ${names} dance in a beam of light`}
          data-otl-opening=""
        />
        <img className="intro__still" src={FIRST_FRAME} alt="" aria-hidden="true" />
        <canvas ref={canvasRef} className="intro__seq" id="anim" aria-hidden="true" />
        <img className="intro__last" src={LAST_FRAME} alt="" aria-hidden="true" />
      </div>
      <div className="intro__shade" aria-hidden="true" />
      <div className="intro__veil" aria-hidden="true" />

      <div className="intro__top">
        <p className="intro__for" id="introFor">
          {guest ? `${guest}, your invitation is under the glitter` : 'An invitation is hiding under the glitter'}
        </p>
        <span className="intro__mono">{COUPLE.monogram}</span>
      </div>
      <div className="intro__hint">
        <p className="intro__tap">Tap the glitter</p>
        <p className="intro__or">and watch it fall away</p>
      </div>

      <div className="hero" aria-live="polite">
        <p className="hero__tog" id="heroFor">
          {guest ? `Dear ${guest},` : 'With the blessings of our families'}
        </p>
        <h1 className="hero__names">
          <span className="hero__n hero__n--1">{COUPLE.first}</span>
          <span className="hero__amp">&</span>
          <span className="hero__n hero__n--2">{COUPLE.second}</span>
        </h1>
        <p className="hero__inv">invite you to celebrate their wedding</p>
        <p className="hero__date">{COUPLE.dateDots}</p>
        <p className="hero__place">{EVENT.place}</p>
      </div>
      {fx.names && (
        <div className="tunnel-section__hint" aria-hidden="true">
          <span>Scroll to explore</span>
          <i />
        </div>
      )}

      {debug && createPortal(<pre ref={debugRef} style={DEBUG_STYLE} />, document.body)}
    </header>
  )
}
