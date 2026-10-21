import React, { useEffect, useState } from 'react';
import { CONTENT } from '../../data/content';

type Phase = 'loading' | 'leaving' | 'gone';

/** Dark loading screen with the name and a thin progress line. */
export function Loader({ ready }: {ready: boolean;}) {
  const [phase, setPhase] = useState<Phase>('loading');

  useEffect(() => {
    if (!ready) return;
    const t1 = window.setTimeout(() => setPhase('leaving'), 450);
    const t2 = window.setTimeout(() => setPhase('gone'), 450 + 300);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [ready]);

  if (phase === 'gone') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#100D18] transition-opacity duration-300 ease-out"
      style={{ opacity: phase === 'leaving' ? 0 : 1 }}>
      
      <p className="text-[28px] font-semibold tracking-[-0.03em] text-white">{CONTENT.name}</p>
      <div className="mt-5 h-px w-44 overflow-hidden bg-white/15">
        <div className="loader-line h-full w-full bg-white" data-ready={ready} />
      </div>
      <span className="sr-only">{ready ? 'Ready' : 'Loading the journey'}</span>
    </div>);

}