import React, { useMemo } from 'react';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Group3D, Mesh3D } from '../engine/objects';

const ARCH_X = [-27, -18, -9, 0, 9, 18, 27];
const PIER_X = [-31.5, -22.5, -13.5, -4.5, 4.5, 13.5, 22.5, 31.5];
const R = 3.5;
const SPRING = 0.7;
const DECK_BOTTOM = 4.3;
const DEPTH = 4;
const STONE = '#B9A48C';
const STONE_DARK = '#9C8770';
const STONE_LIGHT = '#D3C1A8';

/** Stone bridge spanning x with seven round arches; the camera passes under the centre arch. */
export function StoneBridge({ z }: {z: number;}) {
  const steps = useMemo(() => {
    const items: InstanceItem[] = [];
    ARCH_X.forEach((cx) => {
      [1.25, 1.75, 2.25, 2.75, 3.25].forEach((dx) => {
        const outer = dx + 0.25;
        const h = SPRING + Math.sqrt(Math.max(0, R * R - outer * outer));
        [-1, 1].forEach((side) => {
          items.push({ p: [cx + side * dx, (h + DECK_BOTTOM) / 2, z], s: [0.5, DECK_BOTTOM - h, DEPTH] });
        });
      });
    });
    return items;
  }, [z]);

  return (
    <Group3D>
      <Part c={STONE} p={[0, 4.9, z]} s={[68, 1.2, DEPTH]} />
      <Part c={STONE_LIGHT} p={[0, 5.8, z - 1.85]} s={[68, 0.6, 0.3]} />
      <Part c={STONE_LIGHT} p={[0, 5.8, z + 1.85]} s={[68, 0.6, 0.3]} />
      {PIER_X.map((x) =>
      <Part key={x} c={STONE} p={[x, 1.5, z]} s={[2, 5.6, DEPTH]} />
      )}
      <InstancedItems items={steps} geometry={GEO.box} material={lambert(STONE)} />
      {ARCH_X.map((cx) =>
      <Group3D key={cx}>
          <Mesh3D
          geometry={GEO.halfCylOpen}
          material={lambert(STONE_DARK, { doubleSide: true })}
          position={[cx, SPRING, z]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[R, DEPTH, R]} />
        
          <Mesh3D geometry={GEO.archRing} material={lambert(STONE_LIGHT)} position={[cx, SPRING, z + DEPTH / 2]} scale={R + 0.15} />
          <Mesh3D geometry={GEO.archRing} material={lambert(STONE_LIGHT)} position={[cx, SPRING, z - DEPTH / 2]} scale={R + 0.15} />
        </Group3D>
      )}
    </Group3D>);

}