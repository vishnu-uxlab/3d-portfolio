import React from 'react';
import { Part } from '../core/Part';
import { Group3D } from '../engine/objects';
import type { V3 } from '../../../types/scroll';

const CREAM = '#F3E7C9';
const GOLD = '#D4A63A';
const STONE = '#D9CBB0';
const FACE = '#FFFDF5';
const DARK = '#3A2E2A';

/** Kollam Clock Tower: cream shaft, gold trim, four clock faces and a gold dome. */
export function ClockTower({ position }: {position: V3;}) {
  const corners: [number, number][] = [
  [1.7, 1.7],
  [-1.7, 1.7],
  [1.7, -1.7],
  [-1.7, -1.7]];

  return (
    <Group3D position={position}>
      <Part c={STONE} p={[0, 0.2, 0]} s={[6, 0.4, 6]} />
      <Part c={STONE} p={[0, 0.9, 0]} s={[5, 1, 5]} />
      <Part c={CREAM} p={[0, 3.9, 0]} s={[3.4, 5, 3.4]} />
      <Part c={GOLD} p={[0, 6.5, 0]} s={[3.7, 0.3, 3.7]} />
      <Part c={CREAM} p={[0, 9.15, 0]} s={[3, 5, 3]} />
      {[0, 1, 2, 3].map((k) =>
      <Group3D key={k} rotation={[0, k * Math.PI / 2, 0]}>
          <Part c={DARK} p={[0, 8.9, 1.51]} s={[0.6, 1.5, 0.05]} />
          <Part c={DARK} p={[0, 3.6, 1.71]} s={[0.9, 1.8, 0.05]} />
        </Group3D>
      )}
      <Part c={GOLD} p={[0, 11.75, 0]} s={[3.4, 0.3, 3.4]} />
      <Part c={CREAM} p={[0, 13.6, 0]} s={[3.6, 3.4, 3.6]} />
      {[0, 1, 2, 3].map((k) =>
      <Group3D key={k} rotation={[0, k * Math.PI / 2, 0]}>
          <Part g="disc" c={GOLD} p={[0, 13.6, 1.82]} s={[2.64, 0.08, 2.64]} r={[Math.PI / 2, 0, 0]} />
          <Part g="disc" c={FACE} p={[0, 13.6, 1.87]} s={[2.4, 0.08, 2.4]} r={[Math.PI / 2, 0, 0]} />
          <Part c={DARK} p={[0, 13.95, 1.93]} s={[0.1, 0.8, 0.04]} />
          <Part c={DARK} p={[0.25, 13.6, 1.93]} s={[0.55, 0.1, 0.04]} />
        </Group3D>
      )}
      <Part c={GOLD} p={[0, 15.45, 0]} s={[4, 0.35, 4]} />
      {corners.map(([x, z]) =>
      <Group3D key={`${x}${z}`}>
          <Part g="cyl6" c={GOLD} p={[x, 16.1, z]} s={[0.3, 1, 0.3]} />
          <Part g="cone4" c={GOLD} p={[x, 16.9, z]} s={[0.4, 0.6, 0.4]} />
        </Group3D>
      )}
      <Part c={CREAM} p={[0, 16.4, 0]} s={[2.6, 1.6, 2.6]} />
      <Part c={GOLD} p={[0, 17.25, 0]} s={[2.9, 0.2, 2.9]} />
      <Part g="hemi" c={GOLD} p={[0, 17.3, 0]} s={[3.2, 3.2, 3.2]} />
      <Part g="cyl6" c={GOLD} p={[0, 19.2, 0]} s={[0.25, 0.9, 0.25]} />
      <Part g="cone8" c={GOLD} p={[0, 20.1, 0]} s={[0.45, 1, 0.45]} />
    </Group3D>);

}