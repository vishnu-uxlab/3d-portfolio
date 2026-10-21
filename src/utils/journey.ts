import { CatmullRomCurve3, Vector3 } from 'three';
import { clamp, lerp, remap, smooth } from './progress';
import type { V3 } from '../types/scroll';

export type Range = [number, number];

export const SCENE_RANGES: Record<'kollam' | 'town' | 'ride' | 'sky' | 'skydive' | 'chennai', Range> = {
  kollam: [0, 0.2],
  town: [0.08, 0.325],
  ride: [0.275, 0.6],
  sky: [0.48, 0.83],
  skydive: [0.77, 0.9],
  chennai: [0.8, 1.01]
};

export const NAV_LINKS = [
{ label: 'Home', progress: 0 },
{ label: 'About', progress: 0.18 },
{ label: 'Skills', progress: 0.28 },
{ label: 'Toolkit', progress: 0.51 },
{ label: 'Work', progress: 0.6 },
{ label: 'Contact', progress: 0.88 }];


export const RIDE_START = 0.285;
export const RIDE_END = 0.515;
export const FALL_START = 0.795;
export const FALL_END = 0.875;

export const TOWN_CENTER = new Vector3(0, 0, -90);
export const LAMP_POS = new Vector3(0, 62, -300);
export const LAND_POS = new Vector3(0, 0, -404);

const ROAD_POINTS: [number, number][] = [
[15.5, -82],
[15.5, -90],
[15.5, -104],
[10, -118],
[2, -130],
[9, -148],
[-6, -170],
[-9, -190],
[3, -210],
[0, -228],
[0, -245],
[0, -260]];


export const roadCurve = new CatmullRomCurve3(
  ROAD_POINTS.map(([x, z]) => new Vector3(x, 0, z)),
  false,
  'centripetal'
);
export const ROAD_LENGTH = roadCurve.getLength();
const ROAD_SAMPLES = roadCurve.getSpacedPoints(240);

export function distanceToRoad(x: number, z: number) {
  let min = Infinity;
  for (const s of ROAD_SAMPLES) {
    const d = (s.x - x) ** 2 + (s.z - z) ** 2;
    if (d < min) min = d;
  }
  return Math.sqrt(min);
}

export function rideU(p: number) {
  return smooth(remap(p, RIDE_START, RIDE_END)) * 0.985;
}

export function rideState(p: number, pos: Vector3, tan: Vector3) {
  const u = rideU(p);
  roadCurve.getPointAt(u, pos);
  roadCurve.getTangentAt(u, tan);
  return u;
}

const _a = new Vector3();
const _b = new Vector3();
/** Positive when the road bends left. */
export function rideTurn(u: number) {
  roadCurve.getTangentAt(clamp(u - 0.012, 0, 1), _a);
  roadCurve.getTangentAt(clamp(u + 0.012, 0, 1), _b);
  return _a.z * _b.x - _a.x * _b.z;
}

export function fallPosition(p: number, out: Vector3) {
  const t = remap(p, FALL_START, FALL_END);
  const e = 1 - Math.pow(1 - t, 1.4);
  return out.set(Math.sin(t * 4) * 2.5 * (1 - t), lerp(100, LAND_POS.y, e), lerp(-399, LAND_POS.z, t));
}

export type CameraKey = {p: number;pos: V3;tgt: V3;};

export const CAMERA_KEYS: CameraKey[] = [
{ p: 0.0, pos: [3, 3, 17], tgt: [-1, 2.6, -20] },
{ p: 0.05, pos: [2, 2.4, 6], tgt: [0, 2, -30] },
{ p: 0.09, pos: [0.5, 1.8, -18], tgt: [0, 1.8, -50] },
{ p: 0.12, pos: [0, 1.7, -40], tgt: [0, 1.9, -70] },
{ p: 0.145, pos: [0, 1.9, -56], tgt: [0, 3, -85] },
{ p: 0.175, pos: [-2, 4.5, -64], tgt: [-4, 7, -90] },
{ p: 0.21, pos: [-3, 5.5, -65], tgt: [-7, 6.5, -89] },
{ p: 0.26, pos: [2, 5, -66], tgt: [-5, 6.5, -89] },
{ p: 0.29, pos: [-2.5, 4.3, -69], tgt: [10, 1.4, -81] },
{ p: 0.4, pos: [0, 4.5, -160], tgt: [0, 1.2, -178] },
{ p: 0.515, pos: [0, 4.5, -249], tgt: [0, 1.5, -266] },
{ p: 0.535, pos: [0, 6, -246], tgt: [0, 26, -276] },
{ p: 0.56, pos: [10, 42, -262], tgt: [0, 64, -300] },
{ p: 0.6, pos: [-22.8, 72, -307.4], tgt: [0, 71, -300] },
{ p: 0.62, pos: [-30, 99, -330], tgt: [-30, 95, -372] },
{ p: 0.78, pos: [30, 99, -330], tgt: [30, 95, -372] },
{ p: 0.8, pos: [0, 108, -394], tgt: [0, 98, -399] },
{ p: 0.862, pos: [0, 15, -397], tgt: [0, 2, -404] },
{ p: 0.882, pos: [2, 3.6, -393], tgt: [0, 4.5, -425] },
{ p: 0.93, pos: [0, 38, -408], tgt: [0, 10, -447] },
{ p: 1.0, pos: [0, 38, -408], tgt: [0, 10, -447] }];