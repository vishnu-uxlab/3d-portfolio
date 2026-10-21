import React, { useCallback, useRef, useState } from 'react';
import { World } from './components/scene/World';
import { Overlay } from './components/overlay/Overlay';
import { TopControls } from './components/overlay/TopControls';
import { Loader } from './components/overlay/Loader';
import { useScrollProgress } from './hooks/useScrollProgress';
import type { ScrollState } from './types/scroll';

export function App() {
  const scroll = useRef<ScrollState>({ target: 0, progress: 0, velocity: 0, mouseX: 0, mouseY: 0, initialized: false });
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  useScrollProgress(scroll);

  return (
    <div className="relative w-full bg-[#16121F]">
      <World scroll={scroll} onReady={handleReady} />
      <div className="vignette pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />
      <main className="relative z-[2]">
        <div style={{ height: '930vh' }} aria-hidden="true" />
      </main>
      <Overlay scroll={scroll} />
      <TopControls />
      <Loader ready={ready} />
    </div>);

}