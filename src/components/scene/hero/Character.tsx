import React, { type MutableRefObject } from 'react';
import type { Group } from 'three';
import { Part } from '../core/Part';
import { Group3D } from '../engine/objects';

export type Limbs = {
  pivot: Group | null;
  armL: Group | null;
  armR: Group | null;
  legL: Group | null;
  legR: Group | null;
};

const SKIN = '#B9805A';
const JACKET = '#2A2C3F';
const PANTS = '#3E4C6E';
const SHOES = '#1E1E24';
const HAIR = '#1B1716';
const SHIRT = '#F3EEE6';

/** ~1.85 unit low-poly person facing +z. Limbs pivot at shoulders/hips; `pivot` sits at the hips for whole-body tilts. */
export function Character({ limbs }: {limbs: MutableRefObject<Limbs>;}) {
  return (
    <Group3D ref={(g) => limbs.current.pivot = g} position={[0, 1, 0]}>
      <Group3D position={[0, -1, 0]}>
        {([
        ['legL', 0.11],
        ['legR', -0.11]] as
        const).map(([k, x]) =>
        <Group3D key={k} ref={(g) => limbs.current[k] = g} position={[x, 0.92, 0]}>
            <Part c={PANTS} p={[0, -0.42, 0]} s={[0.17, 0.84, 0.2]} />
            <Part c={SHOES} p={[0, -0.87, 0.05]} s={[0.19, 0.1, 0.3]} />
          </Group3D>
        )}
        <Part c={JACKET} p={[0, 1.22, 0]} s={[0.48, 0.64, 0.27]} />
        <Part c={SHIRT} p={[0, 1.42, 0.137]} s={[0.14, 0.22, 0.01]} />
        {([
        ['armL', 0.31],
        ['armR', -0.31]] as
        const).map(([k, x]) =>
        <Group3D key={k} ref={(g) => limbs.current[k] = g} position={[x, 1.5, 0]}>
            <Part c={JACKET} p={[0, -0.29, 0]} s={[0.13, 0.58, 0.15]} />
            <Part g="ico" c={SKIN} p={[0, -0.63, 0]} s={0.12} />
          </Group3D>
        )}
        <Part g="cyl6" c={SKIN} p={[0, 1.585, 0]} s={[0.1, 0.1, 0.1]} />
        <Part g="ico" c={SKIN} p={[0, 1.74, 0]} s={0.32} />
        <Part g="hemi" c={HAIR} p={[0, 1.76, -0.01]} s={[0.35, 0.3, 0.35]} r={[-0.2, 0, 0]} />
      </Group3D>
    </Group3D>);

}