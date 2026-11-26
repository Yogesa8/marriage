import { useCallback, useEffect, useRef, useState } from "react";
import { EVENT } from "./data/invite";
import { OCCASION_EVENT } from "./utils/occasion";
import { asset, getGuestName } from "./utils/helpers";
import { VARIANT_CFG } from "./utils/variant";
import Music from "./components/Music";
import useSmoothScroll from "./hooks/useSmoothScroll";
import Splash from "./components/Splash";
import Intro from "./components/Intro";
import Letter from "./components/Letter";
import Calendar from "./components/Calendar";
import Celebrations from "./components/Celebrations";
import Venue from "./components/Venue";
import Wishes from "./components/Wishes";
import PerspectiveTunnel from "./components/PerspectiveTunnel";
import Closing from "./components/Closing";

if (typeof window !== "undefined" && "scrollRestoration" in history) {
  /* a reload mid-page must start from the intro, not from the old scroll position */
  history.scrollRestoration = "manual";
}

export default function App() {
  /* personal invitation: ?g=Sharma%20Family shows that name; without ?g= the general text is shown */
  const [guest] = useState(getGuestName);
  /* the intro film has buffered: the splash can be opened */
  const [videoReady, setVideoReady] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  /* the names have appeared: the intro is over and the page can scroll */
  const [named, setNamed] = useState(false);

  const introApi = useRef(null);
  const musicApi = useRef(null);
  const dateRef = useRef(null);

  const onNamed = useCallback(() => setNamed(true), []);
  const onVideoReady = useCallback(() => setVideoReady(true), []);
  /* Runs inside the splash click so the phone can unlock the music. */
  const onSplashOpen = useCallback(() => {
    if (musicApi.current) musicApi.current.unlock();
    if (introApi.current) introApi.current.activate();
  }, []);
  /* The glitter falls: start the background music. */
  const onIntroOpen = useCallback(() => {
    if (musicApi.current) musicApi.current.start();
  }, []);

  /* while the intro plays the page is locked (html.is-intro) */
  useEffect(() => {
    document.documentElement.classList.toggle("is-intro", !named);
  }, [named]);

  /* Lenis smooth scrolling, switched on once the page unlocks */
  useSmoothScroll(named);

  return (
    <>
      <Splash
        ready={videoReady}
        progress={videoProgress}
        guest={guest}
        onOpen={onSplashOpen}
      />
      <Music src={EVENT.music ? asset(EVENT.music) : ""} apiRef={musicApi} />

      <Intro
        apiRef={introApi}
        guest={guest}
        onOpen={onIntroOpen}
        onNamed={onNamed}
        onReady={onVideoReady}
        onProgress={setVideoProgress}
      />

      <main id="page">
        <Letter guest={guest} />
        <Calendar sectionRef={dateRef} />
        <Celebrations />
        <Venue />
        <Wishes />
        {VARIANT_CFG.photos && <PerspectiveTunnel />}
        <Closing />
      </main>
      <small className="made">
        {OCCASION_EVENT.title}
        <br />
        {EVENT.phone.split(' / ').map((phone, i) => (
          <span key={phone}>
            {i > 0 && ' / '}
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
          </span>
        ))}
      </small>
    </>
  );
}
