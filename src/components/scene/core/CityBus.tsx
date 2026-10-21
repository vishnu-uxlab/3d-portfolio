import React from 'react';
import { Part } from './Part';
import { Group3D } from '../engine/objects';

const GREEN = '#2E8B57';
const TYRE = '#151518';

/** Green town bus, facing +z. */
export function CityBus() {
  const wheels: [number, number][] = [
  [1.15, 2.6],
  [-1.15, 2.6],
  [1.15, -2.6],
  [-1.15, -2.6]];

  return (
    <Group3D>
      <Part c={GREEN} p={[0, 1.65, 0]} s={[2.4, 2.5, 8]} />
      <Part c="#F3E7C9" p={[0, 1.55, 0]} s={[2.42, 0.28, 8.02]} />
      <Part c="#33404A" p={[0, 2.3, 0.2]} s={[2.44, 0.75, 7]} />
      <Part c="#33404A" p={[0, 2.2, 4.0]} s={[2.1, 0.9, 0.05]} />
      <Part c="#256E46" p={[0, 2.95, 0]} s={[2.3, 0.12, 7.8]} />
      <Part g="ico" c="#FFF2C4" glow p={[0.8, 0.9, 4.02]} s={0.2} />
      <Part g="ico" c="#FFF2C4" glow p={[-0.8, 0.9, 4.02]} s={0.2} />
      {wheels.map(([x, z]) =>
      <Part key={`${x}${z}`} g="cyl" c={TYRE} p={[x, 0.45, z]} s={[0.9, 0.3, 0.9]} r={[0, 0, Math.PI / 2]} />
      )}
    </Group3D>);

}