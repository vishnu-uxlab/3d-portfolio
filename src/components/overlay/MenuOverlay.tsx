import React, { useEffect, useRef } from 'react';
import { NAV_LINKS } from '../../utils/journey';
import { scrollToProgress } from '../../utils/dom';

type Props = {onClose: () => void;};

/** Full-screen menu that smooth-scrolls to each chapter of the journey. */
export function MenuOverlay({ onClose }: Props) {
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="anim-overlay-in fixed inset-0 z-40 flex flex-col bg-[#120E1C]/85 px-6 py-6 text-white backdrop-blur-md md:px-12 md:py-8">
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-[15px] font-medium text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
          
          close <span aria-hidden="true">✕</span>
        </button>
      </div>
      <nav aria-label="Sections" className="flex flex-1 items-center">
        <ul className="space-y-1 md:space-y-2">
          {NAV_LINKS.map((l, i) =>
          <li key={l.label}>
              <button
              ref={i === 0 ? firstRef : undefined}
              type="button"
              onClick={() => {
                onClose();
                scrollToProgress(l.progress);
              }}
              className="text-left text-[48px] font-bold leading-[1.1] tracking-[-0.035em] text-white/65 transition-colors duration-150 hover:text-white focus-visible:text-white focus-visible:outline-none md:text-[88px]">
              
                {l.label}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>);

}