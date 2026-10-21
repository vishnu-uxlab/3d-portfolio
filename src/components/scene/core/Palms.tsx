import React, { useMemo } from 'react';
import { GEO, lambert } from './materials';
import { InstancedItems, type InstanceItem } from './InstancedItems';
import { Group3D } from '../engine/objects';
import { mulberry32, pick } from '../../../utils/random';

/** [x, z, height?, lean?] */
export type PalmSpec = [number, number, number?, number?];

const FRONDS = 7;
const FROND_LEN = 2.6;
const FROND_COLORS = ['#3D9A42', '#4EAE4C', '#2E8A38', '#67C15A'];

export function Palms({ items, y = 0, seed = 1 }: {items: PalmSpec[];y?: number;seed?: number;}) {
  const { trunks, fronds, nuts } = useMemo(() => {
    const rand = mulberry32(seed);
    const t: InstanceItem[] = [];
    const f: InstanceItem[] = [];
    const n: InstanceItem[] = [];
    items.forEach(([x, z, h = 6, lean = 0]) => {
      t.push({ p: [x - Math.sin(lean) * h * 0.5, y + Math.cos(lean) * h * 0.5, z], s: [1, h, 1], r: [0, 0, lean] });
      const cx = x - Math.sin(lean) * h;
      const cy = y + Math.cos(lean) * h;
      const spin = rand() * Math.PI;
      for (let i = 0; i < FRONDS; i++) {
        const th = spin + i / FRONDS * Math.PI * 2;
        const droop = 0.35 + rand() * 0.35;
        f.push({
          p: [
          cx + Math.sin(th) * Math.cos(droop) * FROND_LEN * 0.5,
          cy - Math.sin(droop) * FROND_LEN * 0.5,
          z + Math.cos(th) * Math.cos(droop) * FROND_LEN * 0.5],

          s: [0.55, 0.06, FROND_LEN],
          r: [droop, th, 0],
          c: pick(rand, FROND_COLORS)
        });
      }
      n.push({ p: [cx, cy - 0.25, z], s: 0.55 });
    });
    return { trunks: t, fronds: f, nuts: n };
  }, [items, y, seed]);

  return (
    <Group3D>
      <InstancedItems items={trunks} geometry={GEO.trunk} material={lambert('#8B6B4A')} />
      <InstancedItems items={fronds} geometry={GEO.box} material={lambert('#ffffff')} />
      <InstancedItems items={nuts} geometry={GEO.ico0} material={lambert('#6B4A2B')} />
    </Group3D>);

}