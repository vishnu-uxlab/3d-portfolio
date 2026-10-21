import React from 'react';
import { Part } from '../core/Part';
import { Group3D } from '../engine/objects';

const YELLOW = '#F6C324';
const BLACK = '#1D1D22';

/** Chennai yellow taxi, facing +z. */
export function Taxi() {
  const wheels: [number, number][] = [
  [0.82, 1.15],
  [-0.82, 1.15],
  [0.82, -1.15],
  [-0.82, -1.15]];

  return (
    <Group3D>
      <Part c={YELLOW} p={[0, 0.62, 0]} s={[1.7, 0.6, 3.6]} />
      <Part c={YELLOW} p={[0, 1.16, -0.15]} s={[1.5, 0.52, 1.9]} />
      <Part c="#33404A" p={[0, 1.18, -0.15]} s={[1.52, 0.32, 1.6]} />
      <Part c={BLACK} p={[0, 0.42, 0]} s={[1.72, 0.12, 3.62]} />
      <Part c={BLACK} p={[0, 1.5, -0.15]} s={[0.5, 0.14, 0.25]} />
      <Part g="ico" c="#FFF2C4" glow p={[0.55, 0.7, 1.81]} s={0.16} />
      <Part g="ico" c="#FFF2C4" glow p={[-0.55, 0.7, 1.81]} s={0.16} />
      {wheels.map(([x, z]) =>
      <Part key={`${x}${z}`} g="cyl" c="#151518" p={[x, 0.32, z]} s={[0.62, 0.2, 0.62]} r={[0, 0, Math.PI / 2]} />
      )}
    </Group3D>);

}