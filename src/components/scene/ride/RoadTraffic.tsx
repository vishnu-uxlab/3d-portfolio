import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { Group } from 'three';
import { useFrame } from '../engine/hooks';
import { Group3D } from '../engine/objects';
import { AutoRickshaw } from '../core/AutoRickshaw';
import { isShown } from '../core/isShown';
import { roadCurve } from '../../../utils/journey';
import { device } from '../../../utils/device';
import type { ScrollRef } from '../../../types/scroll';

const START = 0.18;
const SPAN = 0.7;
const LANE = 1.85;
const SPEED = 0.034;

const AUTOS = [
  { phase: 0.04, side: 1 },
  { phase: 0.24, side: -1 },
  { phase: 0.44, side: 1 },
  { phase: 0.6, side: -1 }
];

/** Yellow autos cruising the village road, one in each lane, turning at each end. */
export function RoadTraffic({ scroll }: {scroll: ScrollRef;}) {
  const refs = useRef<(Group | null)[]>([]);
  const scratch = useMemo(() => ({ pos: new THREE.Vector3(), tan: new THREE.Vector3() }), []);

  useFrame((state) => {
    const first = refs.current[0];
    if (!first || !isShown(first.parent)) return;
    const t = device.reducedMotion ? scroll.current.progress * 8 : state.clock.elapsedTime * SPEED;
    AUTOS.forEach((auto, i) => {
      const g = refs.current[i];
      if (!g) return;
      const cycle = (auto.phase + t) % (SPAN * 2);
      const forward = cycle < SPAN;
      const along = forward ? cycle : SPAN * 2 - cycle;
      const u = START + along;
      roadCurve.getPointAt(u, scratch.pos);
      roadCurve.getTangentAt(u, scratch.tan);
      const nx = -scratch.tan.z;
      const nz = scratch.tan.x;
      g.position.set(scratch.pos.x + nx * LANE * auto.side, 0.05, scratch.pos.z + nz * LANE * auto.side);
      const facing = Math.atan2(scratch.tan.x, scratch.tan.z);
      g.rotation.y = forward ? facing : facing + Math.PI;
    });
  });

  return (
    <Group3D>
      {AUTOS.map((auto, i) =>
      <Group3D key={auto.phase} ref={(g) => refs.current[i] = g}>
          <AutoRickshaw />
        </Group3D>
      )}
    </Group3D>);

}
