import React, { useRef } from 'react';
import { useProgressFrame } from '../../hooks/useProgressFrame';
import { band, smoothRemap } from '../../utils/progress';
import { reveal } from '../../utils/dom';
import { CONTENT } from '../../data/content';
import type { ScrollRef } from '../../types/scroll';
import { ToolkitIcon } from './toolkitIcons';

const IN = 0.468;
const OUT = 0.585;

/** Toolkit groups beside the climb from the village toward the work, in the Skill Zone's type. */
export function ToolkitList({ scroll }: {scroll: ScrollRef;}) {
  const root = useRef<HTMLDivElement>(null);
  const groups = useRef<(HTMLDivElement | null)[]>([]);

  useProgressFrame(scroll, (p) => {
    reveal(root.current, band(p, IN, OUT, 0.014));
    CONTENT.toolkit.forEach((_, i) => {
      const a = IN + i * 0.005;
      const shown = smoothRemap(p, a, a + 0.01);
      reveal(groups.current[i], shown, 0, 18 * (1 - shown));
    });
  });

  return (
    <section
      aria-labelledby="toolkit-heading"
      className="pointer-events-none fixed inset-x-4 top-[16vh] z-10 md:inset-x-auto md:right-[5vw] md:top-1/2 md:w-[min(680px,50vw)] md:-translate-y-1/2">
      <div ref={root} style={{ opacity: 0, visibility: 'hidden' }} className="glass-toolkit rounded-[28px] px-4 py-4 md:px-7 md:py-7">
      <h2
        id="toolkit-heading"
        className="text-[clamp(26px,3.2vw,42px)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
        My toolkit, your advantage
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 md:mt-6 md:gap-x-10 md:gap-y-6">
        {CONTENT.toolkit.map((group, i) =>
        <div key={group.label} ref={(el) => groups.current[i] = el} style={{ opacity: 0, visibility: 'hidden' }}>
          <div className="flex items-baseline justify-between gap-3 border-b border-white/30 pb-1.5">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white md:text-[13px]">
              {group.label}
            </h3>
            <span className="text-[12px] font-semibold tabular-nums text-white/80">{group.count}</span>
          </div>
          <ul className="mt-2 space-y-1 md:mt-2.5 md:space-y-1.5">
            {group.items.map((item) =>
            <li key={item} className="flex items-center justify-between gap-1.5 text-[12px] font-semibold leading-tight tracking-[-0.01em] text-white md:gap-3 md:text-[16px] md:tracking-normal">
              <span className="flex min-w-0 items-center gap-1 md:gap-2">
                <ToolkitIcon name={item} />
                <span className="min-w-0">{item}</span>
              </span>
              <span aria-hidden="true" className="shrink-0 text-[13px] font-medium text-white/70">→</span>
            </li>
            )}
          </ul>
        </div>
        )}
      </div>
      </div>
    </section>
  );
}
