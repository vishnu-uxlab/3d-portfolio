export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export const remap = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

export const smooth = (t: number) => t * t * (3 - 2 * t);

export const smoothRemap = (v: number, a: number, b: number) => smooth(remap(v, a, b));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 1 inside [start, end], easing in over `fade` before start and out over `fade` after end. */
export function band(p: number, start: number, end: number, fade: number) {
  return smoothRemap(p, start - fade, start) * (1 - smoothRemap(p, end, end + fade));
}