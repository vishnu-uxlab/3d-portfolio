import React, { useRef } from 'react';
import { useProgressFrame } from '../../hooks/useProgressFrame';
import { smoothRemap } from '../../utils/progress';
import { reveal } from '../../utils/dom';
import type { ScrollRef } from '../../types/scroll';

/** "scroll" hint at the bottom centre, hidden once scrolling starts. */
export function ScrollHint({ scroll }: {scroll: ScrollRef;}) {
  const ref = useRef<HTMLDivElement>(null);
  useProgressFrame(scroll, (p) => reveal(ref.current, 1 - smoothRemap(p, 0.002, 0.015)));
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-7 z-10 flex justify-center">
      <div ref={ref} className="flex flex-col items-center gap-2 text-white">
        <span className="text-shadow text-[13px] font-medium tracking-[0.04em]">scroll</span>
        <span className="relative block h-9 w-px overflow-hidden bg-white/30">
          <span className="scroll-hint-dot absolute left-0 top-0 block h-4 w-px bg-white" />
        </span>
      </div>
    </div>);

}