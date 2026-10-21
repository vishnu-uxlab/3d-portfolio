import { useEffect, useRef } from 'react';
import type { ScrollRef } from '../types/scroll';

/** Runs `cb` on animation frames whenever the smoothed progress changes. */
export function useProgressFrame(scroll: ScrollRef, cb: (p: number) => void) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    let id = 0;
    let last = -1;
    const loop = () => {
      const p = scroll.current.progress;
      if (Math.abs(p - last) > 0.00002) {
        last = p;
        cbRef.current(p);
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [scroll]);
}