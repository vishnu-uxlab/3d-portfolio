import React, { useRef } from 'react';
import type { Group } from 'three';
import { useFrame } from '../engine/hooks';
import { Group3D } from '../engine/objects';
import { Taxi } from './Taxi';
import { AutoRickshaw } from '../core/AutoRickshaw';
import { isShown } from '../core/isShown';
import { device } from '../../../utils/device';
import type { ScrollRef } from '../../../types/scroll';

type Vehicle = {kind: 'taxi' | 'auto';lane: number;dir: 1 | -1;speed: number;offset: number;};

const MIN_X = -34;
const SPAN = 64;
const VEHICLES: Vehicle[] = [
{ kind: 'taxi', lane: -416.2, dir: 1, speed: 3.2, offset: 0 },
{ kind: 'auto', lane: -416.2, dir: 1, speed: 3.2, offset: 26 },
{ kind: 'taxi', lane: -420.8, dir: -1, speed: 3.6, offset: 12 },
{ kind: 'auto', lane: -420.8, dir: -1, speed: 3.6, offset: 44 },
{ kind: 'taxi', lane: -416.2, dir: 1, speed: 3.2, offset: 50 }];


/** Yellow taxis and autos moving slowly along the road in front of the station. */
export function StreetTraffic({ scroll }: {scroll: ScrollRef;}) {
  const refs = useRef<(Group | null)[]>([]);
  useFrame((state) => {
    const first = refs.current[0];
    if (!first || !isShown(first.parent)) return;
    const p = scroll.current.progress;
    const t = device.reducedMotion ? p * 60 : state.clock.elapsedTime;
    VEHICLES.forEach((v, i) => {
      const g = refs.current[i];
      if (!g) return;
      const d = ((v.offset + t * v.speed) % SPAN + SPAN) % SPAN;
      g.position.set(v.dir > 0 ? MIN_X + d : MIN_X + SPAN - d, 0.05, v.lane);
      g.rotation.y = v.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    });
  });
  return (
    <Group3D>
      {VEHICLES.map((v, i) =>
      <Group3D key={i} ref={(g) => refs.current[i] = g}>
          {v.kind === 'taxi' ? <Taxi /> : <AutoRickshaw />}
        </Group3D>
      )}
    </Group3D>);

}