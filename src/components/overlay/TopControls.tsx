import React, { useCallback, useRef, useState } from 'react';
import { MenuOverlay } from './MenuOverlay';

const AUDIO_SRC = '/audio/ambient.wav';

/** Top-right "menu" and "sound" controls. */
export function TopControls() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  const toggleSound = () => {
    const el = audio.current;
    if (!el) return;
    if (!el.paused) {
      el.pause();
      setPlaying(false);
      return;
    }
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <div className="fixed right-4 top-4 z-30 flex items-center gap-1 text-white md:right-8 md:top-7">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={playing}
          aria-label={playing ? 'Pause sound' : 'Play sound'}
          className="text-shadow inline-flex h-11 items-center gap-2.5 rounded-full px-3 text-[14px] font-medium transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
          
          <span className="sound-bars flex h-3.5 items-end gap-[3px]" data-playing={playing} aria-hidden="true">
            <span className="sound-bar block h-full w-[2px] rounded-full bg-white" />
            <span className="sound-bar block h-full w-[2px] rounded-full bg-white" />
            <span className="sound-bar block h-full w-[2px] rounded-full bg-white" />
          </span>
          sound
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          className="text-shadow inline-flex h-11 items-center gap-2.5 rounded-full px-3 text-[14px] font-medium transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
          
          menu
          <span className="flex w-4 flex-col gap-[3px]" aria-hidden="true">
            <span className="block h-[2px] w-full rounded-full bg-white" />
            <span className="block h-[2px] w-full rounded-full bg-white" />
            <span className="block h-[2px] w-full rounded-full bg-white" />
          </span>
        </button>
      </div>
      <audio
        ref={audio}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)} />
      {menuOpen && <MenuOverlay onClose={closeMenu} />}
    </>);

}