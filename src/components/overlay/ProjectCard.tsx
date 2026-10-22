import React, { useRef } from 'react';
import { device } from '../../utils/device';
import type { Project } from '../../data/content';

type Props = {project: Project;index: number;total: number;onOpen: () => void;};

/** Tall glass project card. On desktop it lifts and tilts toward the cursor. */
export function ProjectCard({ project, index, total, onOpen }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const tiltEnabled = device.canHover && !device.isMobile && !device.reducedMotion;

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || !tiltEnabled) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translateY(-10px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-label={`Open case study: ${project.title}`}
      className="project-tilt glass-profile group flex h-full w-full flex-col overflow-hidden rounded-[28px] p-3 text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-white/80">
      
      <div className="relative h-[160px] w-full shrink-0 overflow-hidden rounded-[20px] md:h-auto md:flex-1">
        <img src={project.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex flex-col px-3 pb-3 pt-5">
        <span className="text-[12px] font-medium text-white/70">
          {index + 1}/{total}
        </span>
        <h3 className="mt-1 text-[22px] font-bold leading-tight tracking-[-0.02em] md:text-[26px]">{project.title}</h3>
        <p className="mt-2 text-[14px] leading-[1.55] text-white/85 md:text-[15px]">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) =>
          <li key={t} className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[12px] font-medium text-white">
              {t}
            </li>
          )}
        </ul>
        <span className="mt-5 text-[14px] font-semibold text-white">View case study →</span>
      </div>
    </button>);

}