import React from 'react';
import { Part } from './Part';
import { Group3D } from '../engine/objects';

const YELLOW = '#F4C21B';
const BLACK = '#1D1D22';
const TYRE = '#151518';

/** Auto-rickshaw facing +z. Body defaults to yellow; pass `color` for other liveries. */
export function AutoRickshaw({ color = YELLOW }: {color?: string;}) {
  return (
    <Group3D>
      <Part c={color} p={[0, 0.58, -0.15]} s={[1.25, 0.6, 1.7]} />
      <Part c={color} p={[0, 0.85, 0.8]} s={[0.9, 0.95, 0.35]} r={[-0.25, 0, 0]} />
      <Part c={BLACK} p={[0, 1.72, -0.1]} s={[1.32, 0.14, 1.9]} />
      <Part c={BLACK} p={[0, 1.25, -0.95]} s={[1.3, 0.95, 0.08]} />
      <Part c={BLACK} p={[0.62, 1.25, 0.62]} s={[0.06, 0.9, 0.06]} />
      <Part c={BLACK} p={[-0.62, 1.25, 0.62]} s={[0.06, 0.9, 0.06]} />
      <Part c="#9DB8C8" p={[0, 1.42, 0.8]} s={[0.85, 0.5, 0.04]} r={[-0.15, 0, 0]} />
      <Part g="ico" c="#FFF2C4" glow p={[0, 1.05, 1.0]} s={0.14} />
      <Part g="cyl" c={TYRE} p={[0, 0.22, 1.0]} s={[0.44, 0.14, 0.44]} r={[0, 0, Math.PI / 2]} />
      <Part g="cyl" c={TYRE} p={[0.6, 0.22, -0.6]} s={[0.44, 0.14, 0.44]} r={[0, 0, Math.PI / 2]} />
      <Part g="cyl" c={TYRE} p={[-0.6, 0.22, -0.6]} s={[0.44, 0.14, 0.44]} r={[0, 0, Math.PI / 2]} />
    </Group3D>);

}