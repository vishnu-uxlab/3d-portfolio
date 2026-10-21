import React, { useMemo } from 'react';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Group3D } from '../engine/objects';
import type { V3 } from '../../../types/scroll';

const WALL = '#EADCC8';
const TRIM = '#C9B79C';
const GLASS = '#3E4A6B';

/** Tall tiered tower with a spire, the backdrop for "MY WORK" and the start of the ascent. */
export function SpireBuilding({ position }: {position: V3;}) {
  const windows = useMemo(() => {
    const items: InstanceItem[] = [];
    for (let row = 0; row < 4; row++) for (let i = 0; i < 6; i++) items.push({ p: [-6.25 + i * 2.5, 2.5 + row * 3, 5.02], s: [1.2, 1.6, 0.08] });
    for (let row = 0; row < 3; row++) for (let i = 0; i < 4; i++) items.push({ p: [-3.6 + i * 2.4, 15.8 + row * 3, 4.02], s: [1.1, 1.6, 0.08] });
    for (let row = 0; row < 2; row++) for (let i = 0; i < 2; i++) items.push({ p: [-1.2 + i * 2.4, 26 + row * 3, 3.02], s: [1, 1.6, 0.08] });
    return items;
  }, []);
  return (
    <Group3D position={position}>
      <Part c={WALL} p={[0, 7, 0]} s={[16, 14, 10]} />
      <Part c={TRIM} p={[0, 14.2, 0]} s={[16.6, 0.4, 10.6]} />
      <Part c={WALL} p={[0, 19, 0]} s={[10, 10, 8]} />
      <Part c={TRIM} p={[0, 24.2, 0]} s={[10.6, 0.4, 8.6]} />
      <Part c={WALL} p={[0, 28, 0]} s={[6, 8, 6]} />
      <Part c={TRIM} p={[0, 32.2, 0]} s={[6.6, 0.4, 6.6]} />
      <Part g="pyramid" c="#B9A27E" p={[0, 40.4, 0]} s={[4.8, 16, 4.8]} />
      <Part g="cyl6" c="#8C7A60" p={[0, 50, 0]} s={[0.15, 4, 0.15]} />
      <Part g="ico" c="#FF7A6B" glow p={[0, 52.1, 0]} s={0.35} />
      <InstancedItems items={windows} geometry={GEO.box} material={lambert(GLASS)} />
    </Group3D>);

}