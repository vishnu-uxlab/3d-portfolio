import React, { useCallback, useRef, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { useProgressFrame } from '../../hooks/useProgressFrame';
import { band } from '../../utils/progress';
import { reveal } from '../../utils/dom';
import { device } from '../../utils/device';
import { CONTENT } from '../../data/content';
import type { ScrollRef } from '../../types/scroll';

const START = 0.6;
const END = 0.795;
const SEG = (END - START) / 3;

function cardWindow(i: number, n: number): [number, number] {
  const s = i === 0 ? START : START + i * SEG + 0.006;
  const e = i === n - 1 ? END : START + (i + 1) * SEG - 0.006;
  return [s, e];
}

/** One project card at a time above the cloud sea, with a 1/3 · 2/3 · 3/3 indicator. */
export function ProjectCards({ scroll }: {scroll: ScrollRef;}) {
  const [open, setOpen] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const dots = useRef<(HTMLSpanElement | null)[]>([]);
  const counter = useRef<HTMLSpanElement>(null);
  const projects = CONTENT.projects;

  useProgressFrame(scroll, (p) => {
    reveal(wrap.current, band(p, START, END, 0.01));
    let active = 0;
    let best = -1;
    projects.forEach((_, i) => {
      const [s, e] = cardWindow(i, projects.length);
      const o = band(p, s, e, 0.008);
      if (o > best) {
        best = o;
        active = i;
      }
      const dir = p < (s + e) / 2 ? 1 : -1;
      reveal(cards.current[i], o, device.isMobile ? 0 : dir * 48 * (1 - o), device.isMobile ? 24 * (1 - o) : 0, true);
    });
    dots.current.forEach((d, i) => {
      if (!d) return;
      d.style.width = i === active ? '22px' : '6px';
      d.style.opacity = i === active ? '1' : '0.45';
    });
    if (counter.current) counter.current.textContent = `${active + 1} / ${projects.length}`;
  });

  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <section
        aria-labelledby="work-heading"
        className="pointer-events-none fixed inset-x-4 bottom-5 z-10 md:inset-x-auto md:bottom-auto md:right-[7vw] md:top-1/2 md:w-[390px] md:-translate-y-1/2">
        
        <div ref={wrap} style={{ opacity: 0, visibility: 'hidden' }}>
          <div className="mb-3 flex items-center justify-between px-1 text-white">
            <h2 id="work-heading" className="text-shadow text-[14px] font-semibold">
              My Work
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {projects.map((p, i) =>
                <span
                  key={p.id}
                  ref={(el) => dots.current[i] = el}
                  className="block h-1.5 rounded-full bg-white"
                  style={{ width: 6, transition: 'width 200ms cubic-bezier(0.23,1,0.32,1), opacity 200ms ease-out' }} />

                )}
              </div>
              <span ref={counter} className="text-shadow text-[13px] font-medium tabular-nums" aria-live="polite">
                1 / {projects.length}
              </span>
            </div>
          </div>
          <div className="relative h-[430px] md:h-[min(68vh,600px)]" style={{ perspective: '1000px' }}>
            {projects.map((project, i) =>
            <div
              key={project.id}
              ref={(el) => cards.current[i] = el}
              className="absolute inset-0"
              style={{ opacity: 0, visibility: 'hidden' }}>
              
                <ProjectCard project={project} index={i} total={projects.length} onOpen={() => setOpen(i)} />
              </div>
            )}
          </div>
        </div>
      </section>
      {open !== null && <ProjectModal project={projects[open]} onClose={close} />}
    </>);

}