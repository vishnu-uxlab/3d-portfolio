import React, { useRef } from 'react';
import { useProgressFrame } from '../../hooks/useProgressFrame';
import { band } from '../../utils/progress';
import { reveal } from '../../utils/dom';
import { device } from '../../utils/device';
import { CONTENT } from '../../data/content';
import type { ScrollRef } from '../../types/scroll';

/** Frosted glass bio card sliding in from the left at the clock tower. */
export function AboutCard({ scroll }: {scroll: ScrollRef;}) {
  const ref = useRef<HTMLDivElement>(null);
  useProgressFrame(scroll, (p) => {
    const o = band(p, 0.18, 0.27, 0.02);
    reveal(ref.current, o, device.isMobile ? 0 : -56 * (1 - o), device.isMobile ? 32 * (1 - o) : 0, true);
  });
  return (
    <section
      aria-labelledby="about-heading"
      className="pointer-events-none fixed inset-x-4 bottom-5 z-10 md:inset-x-auto md:bottom-auto md:left-[6vw] md:top-1/2 md:w-[440px] md:-translate-y-1/2">
      
      <div ref={ref} style={{ opacity: 0, visibility: 'hidden' }} className="glass rounded-[28px] p-6 text-white md:p-9">
        <h2 id="about-heading" className="text-[13px] font-medium text-white/75 md:text-sm">
          About
        </h2>
        <div className="mt-3 space-y-3">
          {CONTENT.bio.map((paragraph) =>
          <p key={paragraph} className="text-[15px] leading-[1.6] md:text-[18px] md:leading-[1.65]">
              {paragraph}
            </p>
          )}
        </div>
      </div>
    </section>);

}