import React from 'react';
import { SceneGroup } from '../core/SceneGroup';
import { Clouds } from '../core/Clouds';
import { WindStreaks } from './WindStreaks';
import { SCENE_RANGES } from '../../../utils/journey';
import type { ScrollRef } from '../../../types/scroll';

/** Skydive: clouds that thin out as the sky clears, plus rushing wind streaks. */
export function SkydiveScene({ scroll }: {scroll: ScrollRef;}) {
  return (
    <SceneGroup scroll={scroll} range={SCENE_RANGES.skydive}>
      <Clouds
        count={90}
        seed={31}
        area={{ x: [-34, 34], y: [18, 96], z: [-366, -436] }}
        cluster={5}
        scale={[2.4, 5]}
        colors={['#FFFFFF', '#FFF6E6', '#F4F7FB']}
        opacity={0.9}
        drift={2}
        fade={{ scroll, range: [0.835, 0.872] }}
        avoid={(x, _y, z) => Math.abs(x) < 4.5 && Math.abs(z + 401) < 7} />
      
      <WindStreaks scroll={scroll} />
    </SceneGroup>);

}