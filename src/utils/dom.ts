import { device } from './device';

/** Fade + slide an overlay element by direct style writes. */
export function reveal(el: HTMLElement | null, o: number, x = 0, y = 0, interactive = false) {
  if (!el) return;
  el.style.opacity = o.toFixed(3);
  el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
  if (interactive) el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
}

export function scrollToProgress(p: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: p * max, behavior: device.reducedMotion ? 'auto' : 'smooth' });
}