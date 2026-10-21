import React, { useEffect, useRef } from 'react';
import type { Project } from '../../data/content';

type Props = {project: Project;onClose: () => void;};

/** Full-screen case study overlay with Problem, My Role, Process and Outcome. */
export function ProjectModal({ project, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [onClose]);

  const sections = [
  { title: 'Problem', body: project.detail.problem },
  { title: 'My Role', body: project.detail.role },
  { title: 'Process', body: project.detail.process },
  { title: 'Outcome', body: project.detail.outcome }];


  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#120E1C]/55 p-3 backdrop-blur-md md:items-center md:p-8"
      onClick={onClose}>
      
      <div
        className="anim-overlay-in relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-[#1C1628]/90 p-6 text-white shadow-2xl ring-1 ring-white/15 md:p-12"
        onClick={(e) => e.stopPropagation()}>
        
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-[14px] font-medium text-white transition-colors duration-150 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
          
          Close <span aria-hidden="true">✕</span>
        </button>
        <img
          src={project.image}
          alt={project.imageAlt}
          className="h-44 w-full rounded-[22px] object-cover md:h-64" />
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="min-w-0">
            <h2 id="case-study-title" className="text-[32px] font-bold leading-tight tracking-[-0.03em] md:text-[48px]">
              {project.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-[1.6] text-white/80 md:text-[18px]">{project.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((t) =>
              <li key={t} className="rounded-full border border-white/20 px-3 py-1 text-[12px] font-medium text-white/90">
                  {t}
                </li>
              )}
            </ul>
          </div>
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 text-[15px] font-semibold text-[#102033] transition-colors duration-150 hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:mt-3">
            
            {project.link.label}
            <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <dl className="mt-10 grid gap-x-12 gap-y-8 border-t border-white/10 pt-8 md:grid-cols-2">
          {sections.map((s) =>
          <div key={s.title}>
              <dt className="text-[14px] font-semibold text-white">{s.title}</dt>
              <dd className="mt-2 text-[15px] leading-[1.65] text-white/75">{s.body}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>);

}