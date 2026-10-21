import { useFrame } from '../engine/hooks';
import { device } from '../../../utils/device';
import type { ScrollRef } from '../../../types/scroll';

/** Smooths raw scroll progress once per frame, before anything else reads it. */
export function ScrollDriver({ scroll }: {scroll: ScrollRef;}) {
  useFrame((_, dt) => {
    const s = scroll.current;
    if (!s.initialized) {
      s.progress = s.target;
      s.initialized = true;
    }
    const base = device.reducedMotion ? 0.04 : 0.08;
    const k = 1 - Math.pow(1 - base, Math.min(dt, 0.1) * 60);
    const prev = s.progress;
    s.progress += (s.target - s.progress) * k;
    if (Math.abs(s.target - s.progress) < 0.00001) s.progress = s.target;
    s.velocity = s.progress - prev;
  }, -2);
  return null;
}