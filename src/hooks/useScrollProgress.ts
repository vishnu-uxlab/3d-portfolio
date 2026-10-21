import { useEffect } from 'react';
import { clamp } from '../utils/progress';
import type { ScrollRef } from '../types/scroll';

export function useScrollProgress(scroll: ScrollRef) {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current.target = max > 0 ? clamp(window.scrollY / max) : 0;
    };
    const onMove = (e: PointerEvent) => {
      scroll.current.mouseX = e.clientX / window.innerWidth * 2 - 1;
      scroll.current.mouseY = e.clientY / window.innerHeight * 2 - 1;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, [scroll]);
}