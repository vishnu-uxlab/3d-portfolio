import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SceneGroup } from '../core/SceneGroup';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Buildings, type BuildingSpec } from '../core/Buildings';
import { Palms, type PalmSpec } from '../core/Palms';
import { Clouds } from '../core/Clouds';
import { VoxelText } from '../core/VoxelText';
import { Road } from './Road';
import { RoadTraffic } from './RoadTraffic';
import { SpireBuilding } from './SpireBuilding';
import { ROAD_LENGTH, SCENE_RANGES, distanceToRoad, roadCurve } from '../../../utils/journey';
import { thin } from '../../../utils/device';
import { between, mulberry32, pick } from '../../../utils/random';
import type { ScrollRef } from '../../../types/scroll';

const WALLS = ['#F7F4EE', '#FFF9F3', '#F3EFE6', '#EFE8DC'];
const ROOFS = ['#E36B2C', '#D85E24', '#EE7A38'];
const GREENS = ['#5C9A3C', '#6AAD48', '#4E8C36', '#7EBE58'];
const HILL = ['#7CB85A', '#68A64A', '#8FBF62', '#5E9A44', '#9BC96E'];

/** Skills ride: a bright Kerala village road of cottages, palms and hills. */
export function RideScene({ scroll }: {scroll: ScrollRef;}) {
  const { buildings, palms, bushes, hills, patches } = useMemo(() => {
    const rand = mulberry32(41);
    const pos = new THREE.Vector3();
    const tan = new THREE.Vector3();
    const b: BuildingSpec[] = [];
    const pl: PalmSpec[] = [];
    const bushes: InstanceItem[] = [];
    const hills: InstanceItem[] = [];
    const patches: InstanceItem[] = [];

    const place = (u: number, off: number, side: number) => {
      roadCurve.getPointAt(u, pos);
      roadCurve.getTangentAt(u, tan);
      return {
        x: pos.x - tan.z * off * side,
        z: pos.z + tan.x * off * side,
        rot: Math.atan2(tan.x, tan.z)
      };
    };

    const blocked = (x: number, z: number, gap: number) =>
    z > -114 || z < -252 || Math.abs(z + 238) < 7 && Math.abs(x) < 9 || distanceToRoad(x, z) < gap;

    const houseStep = 10.5 / ROAD_LENGTH;
    for (let u = 0.16; u < 0.86; u += houseStep) {
      [-1, 1].forEach((side, si) => {
        const spot = place(Math.min(0.9, u + (si === 0 ? 0 : houseStep * 0.46)), between(rand, 9.4, 11.4), side);
        if (blocked(spot.x, spot.z, 7.4)) return;
        b.push({
          x: spot.x,
          z: spot.z,
          w: between(rand, 3.6, 5.1),
          d: between(rand, 5.2, 7.4),
          h: between(rand, 2.15, 3.15),
          color: pick(rand, WALLS),
          roof: 'terracotta',
          roofColor: pick(rand, ROOFS),
          rot: spot.rot
        });
      });
    }

    const palmStep = 6.4 / ROAD_LENGTH;
    for (let u = 0.15; u < 0.9; u += palmStep) {
      [-1, 1].forEach((side) => {
        const spot = place(u, between(rand, 16, 24), side);
        if (blocked(spot.x, spot.z, 11)) return;
        const lean = side * (0.06 + rand() * 0.12);
        pl.push([spot.x, spot.z, between(rand, 6.5, 10), lean]);
      });
    }

    for (let u = 0.17; u < 0.88; u += 7.5 / ROAD_LENGTH) {
      const side = rand() > 0.5 ? 1 : -1;
      const spot = place(u, between(rand, 7.6, 9.4), side);
      if (blocked(spot.x, spot.z, 6.4)) continue;
      bushes.push({
        p: [spot.x, 0.55, spot.z],
        s: between(rand, 0.7, 1.35),
        c: pick(rand, GREENS)
      });
    }

    for (let u = 0.12; u < 0.94; u += 0.055) {
      [-1, 1].forEach((side) => {
        if (rand() > 0.72) return;
        const spot = place(u, between(rand, 24, 48), side);
        if (distanceToRoad(spot.x, spot.z) < 18) return;
        const w = between(rand, 14, 26);
        const h = between(rand, 7, 16);
        hills.push({
          p: [spot.x, h * 0.12, spot.z],
          s: [w, h, w * between(rand, 0.75, 1.15)],
          c: pick(rand, HILL)
        });
        if (rand() > 0.45) return;
        const px = spot.x * 0.55;
        const pz = spot.z * 0.92 - 18;
        if (distanceToRoad(px, pz) < 18) return;
        patches.push({
          p: [px, 0.03, pz],
          s: [between(rand, 10, 18), 0.04, between(rand, 8, 14)],
          c: pick(rand, GREENS)
        });
      });
    }

    return {
      buildings: thin(b),
      palms: thin(pl),
      bushes: thin(bushes),
      hills: thin(hills),
      patches: thin(patches)
    };
  }, []);

  return (
    <SceneGroup scroll={scroll} range={SCENE_RANGES.ride}>
      <Part g="plane" c="#6AAA48" p={[0, -0.02, -200]} s={[460, 380, 1]} r={[-Math.PI / 2, 0, 0]} />
      <InstancedItems items={patches} geometry={GEO.disc} material={lambert('#ffffff')} />
      <Road />
      <Part g="disc" c="#D8CBB6" p={[0, 0.05, -262]} s={[28, 0.06, 28]} />
      <VoxelText text="MY WORK" cube={0.9} color="#F27BB0" position={[0, 0, -238]} anchor={2} />
      <SpireBuilding position={[0, 0, -276]} />
      <Buildings items={buildings} />
      <Palms items={palms} seed={13} />
      <InstancedItems items={bushes} geometry={GEO.ico} material={lambert('#ffffff')} />
      <InstancedItems items={hills} geometry={GEO.ico} material={lambert('#ffffff')} />
      <RoadTraffic scroll={scroll} />
      <Clouds
        count={36}
        seed={21}
        area={{ x: [-140, 140], y: [36, 62], z: [-60, -300] }}
        cluster={4}
        scale={[6, 11]}
        colors={['#FFFFFF', '#F7FBFF', '#EEF5FB']}
        opacity={1}
        unlit
        drift={2.2}
        avoid={(x, _y, z) => distanceToRoad(x, z) < 24} />
      
    </SceneGroup>);

}
