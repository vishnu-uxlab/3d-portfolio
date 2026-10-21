import React, { useMemo } from 'react';
import { GEO, lambert } from './materials';
import { InstancedItems, type InstanceItem } from './InstancedItems';
import { Group3D } from '../engine/objects';

export type BuildingSpec = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  roof?: 'terracotta' | 'flat';
  rot?: number;
  roofColor?: string;
};

/** Instanced building bodies plus terracotta pyramid roofs or flat parapets. */
export function Buildings({ items }: {items: BuildingSpec[];}) {
  const { bodies, roofs, slabs } = useMemo(() => {
    const b: InstanceItem[] = [];
    const r: InstanceItem[] = [];
    const s: InstanceItem[] = [];
    items.forEach((it) => {
      const rot = it.rot ?? 0;
      b.push({ p: [it.x, it.h / 2, it.z], s: [it.w, it.h, it.d], r: [0, rot, 0], c: it.color });
      if (it.roof === 'terracotta') {
        const rh = Math.min(it.w, it.d) * 0.42;
        r.push({
          p: [it.x, it.h + rh / 2, it.z],
          s: [it.w * 1.12, rh, it.d * 1.12],
          r: [0, rot, 0],
          c: it.roofColor ?? '#C4572E'
        });
      } else if (it.roof === 'flat') {
        s.push({ p: [it.x, it.h + 0.15, it.z], s: [it.w + 0.3, 0.3, it.d + 0.3], r: [0, rot, 0], c: it.roofColor ?? '#D8CFC2' });
      }
    });
    return { bodies: b, roofs: r, slabs: s };
  }, [items]);

  const white = lambert('#ffffff');
  return (
    <Group3D>
      <InstancedItems items={bodies} geometry={GEO.box} material={white} />
      <InstancedItems items={roofs} geometry={GEO.pyramid} material={white} />
      <InstancedItems items={slabs} geometry={GEO.box} material={white} />
    </Group3D>);

}