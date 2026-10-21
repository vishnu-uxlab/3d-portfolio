import React, { useMemo } from 'react';
import { SceneGroup } from '../core/SceneGroup';
import { Part } from '../core/Part';
import { Palms, type PalmSpec } from '../core/Palms';
import { Buildings, type BuildingSpec } from '../core/Buildings';
import { Lake } from './Lake';
import { Lighthouse } from './Lighthouse';
import { FishingNet } from './FishingNet';
import { Houseboat } from './Houseboat';
import { StoneBridge } from './StoneBridge';
import { SCENE_RANGES } from '../../../utils/journey';
import { thin } from '../../../utils/device';
import { between, mulberry32, pick } from '../../../utils/random';
import type { ScrollRef } from '../../../types/scroll';

const GRASS = '#93A86E';
const SAND = '#E2C29A';
const WALLS = ['#F3E6D0', '#EBD3B0', '#F2C9A0', '#E8E1D3', '#D9C7E0', '#F5DCC4'];

/** Opening: Kollam's Ashtamudi Lake at sunset, plus the low fly-through under the bridges. */
export function KollamScene({ scroll }: {scroll: ScrollRef;}) {
  const buildings = useMemo(() => {
    const rand = mulberry32(7);
    const out: BuildingSpec[] = [];
    [-1, 1].forEach((side) => {
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < 11; i++) {
          const x = side * (37 + row * 9 + rand() * 3);
          const z = 0 - i * 5.8 + rand() * 2;
          if (side < 0 && Math.hypot(x + 40, z + 22) < 7) continue;
          out.push({
            x,
            z,
            w: between(rand, 3.5, 5.5),
            d: between(rand, 3.5, 5),
            h: between(rand, 2.5, 5),
            color: pick(rand, WALLS),
            roof: 'terracotta',
            rot: (rand() - 0.5) * 0.3
          });
        }
      }
    });
    return thin(out);
  }, []);

  const palms = useMemo(() => {
    const rand = mulberry32(3);
    const out: PalmSpec[] = [];
    for (let z = 2; z > -60; z -= 4.5) {
      out.push([-34 - rand() * 2.5, z + rand() * 2, 5 + rand() * 3, rand() * 0.25 + 0.05]);
      if (![-8, -20, -32].some((nz) => Math.abs(nz - z) < 3)) out.push([33.5 + rand() * 2.5, z + rand() * 2, 5 + rand() * 3, -(rand() * 0.25 + 0.05)]);
    }
    for (let x = -30; x < 31; x += 4) {
      if (x > -4 && x < 12) continue;
      out.push([x + rand() * 2, 9 + rand() * 5, 5 + rand() * 3, (rand() - 0.5) * 0.4]);
    }
    return thin(out);
  }, []);

  return (
    <SceneGroup scroll={scroll} range={SCENE_RANGES.kollam}>
      <Lake />
      <Part c={GRASS} p={[0, -1.5, 22.5]} s={[64, 3, 35]} />
      <Part c={SAND} p={[0, -1.49, 6]} s={[64, 3, 2.2]} />
      <Part c={GRASS} p={[-61, -1.5, -16]} s={[58, 3, 92]} />
      <Part c={GRASS} p={[61, -1.5, -16]} s={[58, 3, 92]} />
      <Part c={SAND} p={[-32.4, -1.49, -29]} s={[1.6, 3, 66]} />
      <Part c={SAND} p={[32.4, -1.49, -29]} s={[1.6, 3, 66]} />
      <Lighthouse position={[-40, 0, -22]} />
      {[-8, -20, -32].map((z, i) =>
      <FishingNet key={z} position={[29.5, 0, z]} rotationY={(i - 1) * 0.12} />
      )}
      <Houseboat position={[-12, -0.35, -16]} rotationY={0.5} />
      <StoneBridge z={-40} />
      <StoneBridge z={-56} />
      <Palms items={palms} seed={5} />
      <Buildings items={buildings} />
    </SceneGroup>);

}