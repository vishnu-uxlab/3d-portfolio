import React, { useMemo } from 'react';
import { SceneGroup } from '../core/SceneGroup';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Buildings, type BuildingSpec } from '../core/Buildings';
import { Palms, type PalmSpec } from '../core/Palms';
import { VoxelText } from '../core/VoxelText';
import { ClockTower } from './ClockTower';
import { RoundaboutTraffic } from './RoundaboutTraffic';
import { SCENE_RANGES, TOWN_CENTER, distanceToRoad } from '../../../utils/journey';
import { thin } from '../../../utils/device';
import { between, mulberry32, pick } from '../../../utils/random';
import type { ScrollRef } from '../../../types/scroll';

const SHOP_COLORS = ['#F2D7B6', '#E9C2A6', '#CFE0D4', '#F5E6C8', '#E3D0E8', '#F4C9B8', '#D6E4EC'];
const AWNINGS = ['#D9534F', '#2E8B8B', '#F0A830', '#5B7FC7', '#C2477A'];
const CZ = TOWN_CENTER.z;

/** About: the clock tower roundabout with garden, shops, traffic and voxel "HI". */
export function TownScene({ scroll }: {scroll: ScrollRef;}) {
  const { hedges, bushes } = useMemo(() => {
    const rand = mulberry32(17);
    const h: InstanceItem[] = [];
    const n = 36;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      h.push({ p: [Math.cos(a) * 10.2, 0.85, CZ + Math.sin(a) * 10.2], s: [1.75, 0.75, 0.7], r: [0, -a + Math.PI / 2, 0] });
    }
    const b: InstanceItem[] = [];
    for (let i = 0; i < 44; i++) {
      const a = rand() * Math.PI * 2;
      const r = between(rand, 3.6, 8.8);
      const pink = rand() > 0.35;
      b.push({
        p: [Math.cos(a) * r, 0.75, CZ + Math.sin(a) * r],
        s: between(rand, 0.7, 1.3),
        c: pink ? pick(rand, ['#F28DB2', '#E8679A', '#F7A8C6']) : pick(rand, ['#4E8C47', '#3F7A3E'])
      });
    }
    return { hedges: h, bushes: thin(b) };
  }, []);

  const { shops, awnings } = useMemo(() => {
    const rand = mulberry32(29);
    const s: BuildingSpec[] = [];
    const aw: InstanceItem[] = [];
    const n = 30;
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2;
      const dx = Math.cos(a);
      const dz = Math.sin(a);
      if (dz > 0.5) continue; // keep the camera side open
      const r = 27 + rand() * 2;
      const x = dx * r;
      const z = CZ + dz * r;
      if (distanceToRoad(x, z) < 7) continue;
      const w = between(rand, 5, 6.5);
      const d = 5;
      const rot = Math.atan2(-dx, -dz);
      s.push({ x, z, w, d, h: between(rand, 3.5, 7.5), color: pick(rand, SHOP_COLORS), roof: rand() > 0.5 ? 'terracotta' : 'flat', rot });
      const ar = r - d / 2 - 0.6;
      aw.push({ p: [dx * ar, 2.6, CZ + dz * ar], s: [w * 0.9, 0.12, 1.4], r: [0.3, rot, 0], c: pick(rand, AWNINGS) });
    }
    return { shops: thin(s), awnings: thin(aw) };
  }, []);

  const palms = useMemo<PalmSpec[]>(
    () =>
    thin(
      [0.9, 2.2, 3.6, 4.4].map((a, i) => [Math.cos(a) * 21, CZ + Math.sin(a) * 21, 6 + i % 2 * 1.5, 0.08 * (i % 2 ? 1 : -1)] as PalmSpec)
    ),
    []
  );

  return (
    <SceneGroup scroll={scroll} range={SCENE_RANGES.town}>
      <Part g="plane" c="#93A86E" p={[0, 0, -87]} s={[260, 50, 1]} r={[-Math.PI / 2, 0, 0]} />
      <Part g="disc" c="#CDBFAF" p={[0, 0.01, CZ]} s={[44, 0.08, 44]} />
      <Part g="disc" c="#5B5560" p={[0, 0.05, CZ]} s={[38, 0.08, 38]} />
      <Part g="disc" c="#E8DCC8" p={[0, 0.2, CZ]} s={[22.6, 0.4, 22.6]} />
      <Part g="disc" c="#6FA35A" p={[0, 0.25, CZ]} s={[22, 0.5, 22]} />
      <InstancedItems items={hedges} geometry={GEO.box} material={lambert('#3E7A3E')} />
      <InstancedItems items={bushes} geometry={GEO.ico} material={lambert('#ffffff')} />
      <ClockTower position={[0, 0.5, CZ]} />
      <VoxelText text="HI" cube={0.5} color="#FFF3E2" position={[-4.2, 0.5, -83.5]} rotation={[0, 0.25, 0]} />
      <Buildings items={shops} />
      <InstancedItems items={awnings} geometry={GEO.box} material={lambert('#ffffff')} />
      <Palms items={palms} seed={9} />
      <RoundaboutTraffic scroll={scroll} />
    </SceneGroup>);

}