import React, { useRef } from 'react';
import { useProgressFrame } from '../../hooks/useProgressFrame';
import { smoothRemap } from '../../utils/progress';
import { reveal } from '../../utils/dom';
import { CONTENT } from '../../data/content';
import type { ScrollRef } from '../../types/scroll';

/** Large faint name + role near the top, fading as scrolling starts. */
export function HeroTitle({ scroll }: {scroll: ScrollRef;}) {
  const ref = useRef<HTMLElement>(null);
  useProgressFrame(scroll, (p) => {
    const o = 1 - smoothRemap(p, 0.004, 0.045);
    reveal(ref.current, o, 0, -smoothRemap(p, 0, 0.05) * 60);
  });
  return (
    <header ref={ref} className="pointer-events-none fixed inset-x-0 top-[9vh] z-10 px-6 text-center">
      <h1 className="text-shadow text-[clamp(56px,11vw,168px)] font-extrabold leading-[0.9] tracking-[-0.045em] text-white/80">
        {CONTENT.name}
      </h1>
      <p className="text-shadow mt-4 text-[clamp(16px,1.6vw,22px)] font-medium tracking-[0.01em] text-white/90">{CONTENT.role}</p>
    </header>);

}