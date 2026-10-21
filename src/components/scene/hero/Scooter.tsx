import React, { type MutableRefObject } from 'react';
import type { Group } from 'three';
import { Part } from '../core/Part';
import { Group3D } from '../engine/objects';

const YELLOW = '#F2C230';

/** Yellow Vespa-style scooter, facing +z. Wheel groups spin around x. */
export function Scooter({ wheels }: {wheels: MutableRefObject<(Group | null)[]>;}) {
  return (
    <Group3D>
      <Part g="ico" c={YELLOW} p={[0, 0.6, -0.34]} s={[0.62, 0.56, 0.95]} />
      <Part c={YELLOW} p={[0, 0.48, -0.34]} s={[0.5, 0.3, 0.8]} />
      <Part c={YELLOW} p={[0, 0.34, 0.14]} s={[0.42, 0.08, 0.62]} />
      <Part c={YELLOW} p={[0, 0.72, 0.5]} s={[0.5, 0.78, 0.1]} r={[-0.22, 0, 0]} />
      <Part g="ico" c={YELLOW} p={[0, 0.38, 0.66]} s={[0.28, 0.26, 0.52]} />
      <Part g="cyl" c="#3A3A40" p={[0, 1.0, 0.56]} s={[0.07, 0.5, 0.07]} r={[-0.22, 0, 0]} />
      <Part g="ico" c={YELLOW} p={[0, 1.24, 0.6]} s={[0.32, 0.18, 0.22]} />
      <Part g="cyl" c="#2B2B30" p={[0, 1.27, 0.56]} s={[0.05, 0.78, 0.05]} r={[0, 0, Math.PI / 2]} />
      <Part g="ico" c="#FFF4C2" glow p={[0, 1.24, 0.71]} s={0.13} />
      <Part c="#4A2E24" p={[0, 0.92, -0.32]} s={[0.44, 0.12, 0.72]} />
      <Part c="#FF5A4E" glow p={[0, 0.72, -0.78]} s={[0.18, 0.08, 0.03]} />
      {[0.66, -0.5].map((z, i) =>
      <Group3D key={z} ref={(g) => wheels.current[i] = g} position={[0, 0.22, z]}>
          <Part g="cyl" c="#1C1C20" s={[0.46, 0.15, 0.46]} r={[0, 0, Math.PI / 2]} />
          <Part c="#BFC3CC" s={[0.17, 0.32, 0.06]} />
        </Group3D>
      )}
    </Group3D>);

}