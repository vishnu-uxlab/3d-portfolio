import React from 'react';
import { Part } from '../core/Part';
import { Group3D } from '../engine/objects';
import type { V3 } from '../../../types/scroll';

const BANDS = 6;

/** Red-and-white striped lighthouse from stacked cylinders. */
export function Lighthouse({ position }: {position: V3;}) {
  return (
    <Group3D position={position}>
      <Part g="cyl6" c="#A89C8C" p={[0, 0.6, 0]} s={[4.4, 1.2, 4.4]} />
      {Array.from({ length: BANDS }).map((_, i) => {
        const r = 1.7 - i * 0.12;
        return <Part key={i} g="cyl" c={i % 2 === 0 ? '#D8473C' : '#F6F1E7'} p={[0, 2.2 + i * 2, 0]} s={[r * 2, 2, r * 2]} />;
      })}
      <Part g="cyl" c="#3B3440" p={[0, 13.35, 0]} s={[3, 0.3, 3]} />
      <Part g="cyl" c="#FFE6A3" glow p={[0, 14.2, 0]} s={[1.3, 1.4, 1.3]} />
      <Part g="cyl" c="#3B3440" p={[0, 14.95, 0]} s={[1.6, 0.15, 1.6]} />
      <Part g="cone8" c="#C23B32" p={[0, 15.6, 0]} s={[1.8, 1.2, 1.8]} />
      <Part g="ico" c="#3B3440" p={[0, 16.35, 0]} s={0.3} />
    </Group3D>);

}