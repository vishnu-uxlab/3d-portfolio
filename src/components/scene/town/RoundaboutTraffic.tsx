import React, { useRef } from 'react';
import type { Group } from 'three';
import { useFrame } from '../engine/hooks';
import { Group3D } from '../engine/objects';
import { AutoRickshaw } from '../core/AutoRickshaw';
import { CityBus } from '../core/CityBus';
import { isShown } from '../core/isShown';
import { TOWN_CENTER } from '../../../utils/journey';
import { device } from '../../../utils/device';
import type { ScrollRef } from '../../../types/scroll';

type VehicleSpec = {kind: 'auto' | 'bus';phase: number;};

const RADIUS = 13.6;
const SPEED = 0.11;
const VEHICLES: VehicleSpec[] = [
{ kind: 'auto', phase: 0.3 },
{ kind: 'bus', phase: 1.6 },
{ kind: 'auto', phase: 3.0 },
{ kind: 'auto', phase: 4.6 }];


/** Three autos and a green bus circling the roundabout slowly. */
export function RoundaboutTraffic({ scroll }: {scroll: ScrollRef;}) {
  const refs = useRef<(Group | null)[]>([]);
  useFrame((state) => {
    const first = refs.current[0];
    if (!first || !isShown(first.parent)) return;
    const p = scroll.current.progress;
    const t = device.reducedMotion ? p * 12 : state.clock.elapsedTime * SPEED;
    VEHICLES.forEach((v, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = v.phase - t;
      g.position.set(TOWN_CENTER.x + Math.cos(a) * RADIUS, 0.09, TOWN_CENTER.z + Math.sin(a) * RADIUS);
      g.rotation.y = Math.atan2(Math.sin(a), -Math.cos(a));
    });
  });
  return (
    <Group3D>
      {VEHICLES.map((v, i) =>
      <Group3D key={i} ref={(g) => refs.current[i] = g}>
          {v.kind === 'auto' ? <AutoRickshaw /> : <CityBus />}
        </Group3D>
      )}
    </Group3D>);

}