import React, { useRef } from 'react';
import { useProgressFrame } from '../../hooks/useProgressFrame';
import { band, smoothRemap } from '../../utils/progress';
import { reveal } from '../../utils/dom';
import { CONTENT } from '../../data/content';
import type { ScrollRef } from '../../types/scroll';

const START = 0.297;
const STEP = 0.026;

/** "The Skill Zone": skills stacked on the right, each rising in at its own point of the ride. */
export function SkillsList({ scroll }: {scroll: ScrollRef;}) {
  const label = useRef<HTMLHeadingElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  useProgressFrame(scroll, (p) => {
    const out = 1 - smoothRemap(p, 0.445, 0.458);
    const lo = band(p, 0.285, 0.445, 0.012);
    reveal(label.current, lo, 0, 12 * (1 - lo));
    CONTENT.skills.forEach((_, i) => {
      const a = START + i * STEP;
      const o = smoothRemap(p, a, a + 0.012) * out;
      reveal(items.current[i], o, 0, 28 * (1 - smoothRemap(p, a, a + 0.012)));
    });
  });
  return (
    <section
      aria-labelledby="skills-heading"
      className="pointer-events-none fixed right-5 top-[13vh] z-10 text-right md:right-[6vw] md:top-1/2 md:-translate-y-1/2">
      
      <h2
        id="skills-heading"
        ref={label}
        style={{ opacity: 0, visibility: 'hidden' }}
        className="text-shadow text-[13px] font-semibold text-white/90 md:text-[15px]">
        
        The Skill Zone
      </h2>
      <ul className="mt-3 space-y-1 md:mt-5 md:space-y-2">
        {CONTENT.skills.map((s, i) =>
        <li
          key={s}
          ref={(el) => items.current[i] = el}
          style={{ opacity: 0, visibility: 'hidden' }}
          className="text-shadow whitespace-nowrap text-[28px] font-bold leading-[1.08] tracking-[-0.02em] text-white md:text-[clamp(36px,4.4vw,68px)]">
          
            {s}
          </li>
        )}
      </ul>
    </section>);

}