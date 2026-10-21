import React, { useMemo } from 'react';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Group3D, Mesh3D } from '../engine/objects';
import type { V3 } from '../../../types/scroll';

const SPANS = [-8, 0, 8];
const R = 4;
const DECK_Y = 1.6;
const WHITE = '#FFFFFF';

/** Napier Bridge: white bowstring arches over the deck. Spans local x. */
export function NapierBridge({ position, rotationY = 0 }: {position: V3;rotationY?: number;}) {
  const hangers = useMemo(() => {
    const items: InstanceItem[] = [];
    SPANS.forEach((cx) => {
      [-2.6, -1.3, 0, 1.3, 2.6].forEach((dx) => {
        const h = Math.sqrt(R * R - dx * dx);
        [-2.8, 2.8].forEach((z) => items.push({ p: [cx + dx, DECK_Y + 0.25 + h / 2, z], s: [0.1, h, 0.1] }));
      });
    });
    return items;
  }, []);
  return (
    <Group3D position={position} rotation={[0, rotationY, 0]}>
      <Part c="#E9E7E2" p={[0, DECK_Y, 0]} s={[26, 0.5, 6]} />
      {[-12, -4, 4, 12].map((x) =>
      <Part key={x} c="#D9D5CC" p={[x, 0.6, 0]} s={[1, 1.6, 5]} />
      )}
      {SPANS.map((cx) =>
      [-2.8, 2.8].map((z) =>
      <Mesh3D key={`${cx}${z}`} geometry={GEO.archRing} material={lambert(WHITE)} position={[cx, DECK_Y + 0.25, z]} scale={R} />
      )
      )}
      <InstancedItems items={hangers} geometry={GEO.box} material={lambert(WHITE)} />
      <Part c={WHITE} p={[0, DECK_Y + 0.6, 2.9]} s={[26, 0.12, 0.1]} />
      <Part c={WHITE} p={[0, DECK_Y + 0.6, -2.9]} s={[26, 0.12, 0.1]} />
    </Group3D>);

}