import React, { useMemo } from 'react';
import { SceneGroup } from '../core/SceneGroup';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Buildings, type BuildingSpec } from '../core/Buildings';
import { Palms, type PalmSpec } from '../core/Palms';
import { Clouds } from '../core/Clouds';
import { CentralStation } from './CentralStation';
import { NapierBridge } from './NapierBridge';
import { Gopuram } from './Gopuram';
import { StreetTraffic } from './StreetTraffic';
import { SCENE_RANGES } from '../../../utils/journey';
import { thin } from '../../../utils/device';
import { between, mulberry32, pick } from '../../../utils/random';
import type { ScrollRef } from '../../../types/scroll';

const CITY = ['#F2E2C4', '#E8C9A0', '#DDE3E8', '#F0D5D0', '#CFE0D4', '#F5F1E8', '#E4D3B8', '#D9D0E6'];

/** Finale: Chennai in daylight — Central station, Marina Beach, Napier Bridge, a gopuram and city traffic. */
export function ChennaiScene({ scroll }: {scroll: ScrollRef;}) {
  const buildings = useMemo(() => {
    const rand = mulberry32(61);
    const out: BuildingSpec[] = [];
    const add = (x: number, z: number, tall: number) => {
      if (Math.hypot(x + 20, z + 505) < 10) return;
      if (Math.abs(x) < 30 && z > -505 && z < -450) return;
      out.push({
        x,
        z,
        w: between(rand, 5, 9),
        d: between(rand, 5, 9),
        h: between(rand, 6, 6 + tall),
        color: pick(rand, CITY),
        roof: 'flat',
        rot: (rand() - 0.5) * 0.2
      });
    };
    for (let i = 0; i < 46; i++) add(between(rand, -32, 28), between(rand, -462, -600), 22);
    for (let i = 0; i < 22; i++) add(between(rand, -110, -60), between(rand, -400, -600), 16);
    for (let i = 0; i < 12; i++) add(between(rand, -34, -28), between(rand, -398, -440), 6);
    return thin(out);
  }, []);

  const palms = useMemo<PalmSpec[]>(() => {
    const rand = mulberry32(67);
    const out: PalmSpec[] = [];
    for (let z = -396; z > -560; z -= 7) out.push([35 + rand() * 4, z + rand() * 3, 6 + rand() * 2, -(0.1 + rand() * 0.2)]);
    [-26, -14, 14, 26].forEach((x) => out.push([x, -412.6, 5.5, 0]));
    return thin(out);
  }, []);

  const dashes = useMemo<InstanceItem[]>(() => {
    const items: InstanceItem[] = [];
    for (let x = -34; x < 32; x += 4) items.push({ p: [x, 0.16, -418.5], s: [1.6, 0.02, 0.18] });
    return items;
  }, []);

  return (
    <SceneGroup scroll={scroll} range={SCENE_RANGES.chennai}>
      <Part g="plane" c="#BDB89A" p={[-108, 0, -470]} s={[284, 320, 1]} r={[-Math.PI / 2, 0, 0]} />
      <Part g="plane" c="#D9D2C2" p={[0, 0.08, -405]} s={[60, 18, 1]} r={[-Math.PI / 2, 0, 0]} offset />
      <Part g="plane" c="#5E5A66" p={[-2, 0.12, -418.5]} s={[68, 9, 1]} r={[-Math.PI / 2, 0, 0]} offset />
      <Part g="plane" c="#DCD5C6" p={[0, 0.08, -432]} s={[60, 18, 1]} r={[-Math.PI / 2, 0, 0]} offset />
      <InstancedItems items={dashes} geometry={GEO.box} material={lambert('#F5F1E8', { offset: true })} />

      <Part c="#EED9A8" p={[43, -1.44, -490]} s={[22, 3, 240]} />
      <Part c="#FFFFFF" p={[53.8, 0.07, -490]} s={[0.6, 0.04, 240]} />
      <Part g="plane" c="#3D8FD1" p={[254, -0.1, -520]} s={[400, 360, 1]} r={[-Math.PI / 2, 0, 0]} />

      <Part g="plane" c="#4E8FC2" p={[-46, 0.05, -520]} s={[16, 360, 1]} r={[-Math.PI / 2, 0, 0]} />
      <NapierBridge position={[-46, 0, -470]} />

      <CentralStation position={[0, 0.2, -447]} />
      <Gopuram position={[-20, 0, -505]} />
      <Buildings items={buildings} />
      <Palms items={palms} seed={71} />
      <StreetTraffic scroll={scroll} />
      <Clouds
        count={60}
        seed={73}
        area={{ x: [-200, 200], y: [55, 95], z: [-520, -700] }}
        cluster={5}
        scale={[6, 12]}
        colors={['#FFFFFF', '#F7FBFF', '#EEF5FB']}
        opacity={0.96}
        drift={4} />
      
    </SceneGroup>);

}