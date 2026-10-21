import React from 'react';
import { SceneGroup } from '../core/SceneGroup';
import { Clouds } from '../core/Clouds';
import { BrassLamp } from './BrassLamp';
import { LAMP_POS, SCENE_RANGES } from '../../../utils/journey';
import type { ScrollRef } from '../../../types/scroll';

const avoidLampAndSpire = (x: number, y: number, z: number) =>
Math.hypot(x - LAMP_POS.x, z - LAMP_POS.z) < 13 && y > LAMP_POS.y - 4 && y < LAMP_POS.y + 22 || Math.hypot(x, z + 276) < 7;

/** Ascent into golden clouds around the brass lamp, and the flat cloud sea for the projects. */
export function SkyScene({ scroll }: {scroll: ScrollRef;}) {
  return (
    <SceneGroup scroll={scroll} range={SCENE_RANGES.sky}>
      <Clouds
        count={150}
        seed={11}
        area={{ x: [-48, 48], y: [36, 84], z: [-245, -350] }}
        cluster={6}
        scale={[2.6, 5.2]}
        flatten={0.7}
        colors={['#FFF4DC', '#FBE3B0', '#F7D08A', '#FFE9C7']}
        opacity={0.88}
        drift={2.5}
        avoid={avoidLampAndSpire} />
      
      <BrassLamp position={LAMP_POS} scale={1.1} />
      <Clouds
        count={140}
        seed={23}
        area={{ x: [-170, 170], y: [82, 86], z: [-290, -640] }}
        scale={[11, 20]}
        flatten={0.32}
        colors={['#FCE7C4', '#F9D9A8', '#F6C9A0', '#FFF1DC']}
        drift={3} />
      
    </SceneGroup>);

}