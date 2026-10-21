const hasWindow = typeof window !== 'undefined';

export const device = {
  isMobile: hasWindow ? window.innerWidth < 768 : false,
  reducedMotion: hasWindow ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  canHover: hasWindow ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : true
};

/** Halves repeated content on small screens. */
export function thin<T>(arr: T[]): T[] {
  return device.isMobile ? arr.filter((_, i) => i % 2 === 0) : arr;
}