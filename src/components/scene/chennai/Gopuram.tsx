import React, { useMemo } from 'react';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Group3D, Mesh3D } from '../engine/objects';
import type { V3 } from '../../../types/scroll';

const TIER_COLORS = ['#E8604C', '#F2B33D', '#3FA7A0', '#8B6CC1', '#4C8ED9', '#E86FA0', '#F2B33D'];
const TIERS = 7;
const TIER_H = 2.1;
const BASE_H = 4;

/** Colourful stepped temple gopuram from tapering stacked boxes. */
export function Gopuram({ position }: {position: V3;}) {
  const { tiers, bumps, top } = useMemo(() => {
    const t: {w: number;d: number;y: number;c: string;}[] = [];
    const b: InstanceItem[] = [];
    let y = BASE_H;
    for (let i = 0; i < TIERS; i++) {
      const w = 9 * Math.pow(0.86, i);
      const d = 6 * Math.pow(0.86, i);
      t.push({ w, d, y, c: TIER_COLORS[i] });
      const n = Math.floor(w / 1.1);
      for (let k = 0; k < n; k++) {
        b.push({ p: [-w / 2 + 0.55 + k * 1.1, y + TIER_H + 0.2, d / 2 - 0.25], s: 0.42, c: TIER_COLORS[(i + k + 2) % TIER_COLORS.length] });
      }
      y += TIER_H;
    }
    return { tiers: t, bumps: b, top: { y, w: 9 * Math.pow(0.86, TIERS) } };
  }, []);

  return (
    <Group3D position={position}>
      <Part c="#E9D9B5" p={[0, BASE_H / 2, 0]} s={[10, BASE_H, 7]} />
      <Part c="#5A3E30" p={[0, 1.6, 3.52]} s={[2.2, 3.2, 0.05]} />
      {tiers.map((t, i) =>
      <Group3D key={i}>
          <Part c="#F5EEDF" p={[0, t.y + 0.12, 0]} s={[t.w + 0.4, 0.25, t.d + 0.4]} />
          <Part c={t.c} p={[0, t.y + TIER_H / 2, 0]} s={[t.w, TIER_H, t.d]} />
        </Group3D>
      )}
      <InstancedItems items={bumps} geometry={GEO.box} material={lambert('#ffffff')} />
      <Group3D position={[0, top.y, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Mesh3D
          geometry={GEO.halfCyl}
          material={lambert('#E8604C', { doubleSide: true })}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1.4, top.w + 0.6, 1.4]} />
        
      </Group3D>
      {[-1, -0.5, 0, 0.5, 1].map((k) =>
      <Part key={k} g="cone8" c="#E8B84A" p={[k * (top.w / 2), top.y + 1.8, 0]} s={[0.35, 0.9, 0.35]} />
      )}
    </Group3D>);

}