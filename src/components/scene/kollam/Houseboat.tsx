import React, { useRef } from 'react';
import type { Group } from 'three';
import { useFrame } from '../engine/hooks';
import { Group3D, Mesh3D } from '../engine/objects';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { isShown } from '../core/isShown';
import { device } from '../../../utils/device';
import type { V3 } from '../../../types/scroll';

const HULL = '#5E3B22';

/** Kerala houseboat (kettuvallam): box hull with a half-cylinder thatched roof. Built along z. */
export function Houseboat({ position, rotationY = 0 }: {position: V3;rotationY?: number;}) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g || device.reducedMotion || !isShown(g)) return;
    const t = state.clock.elapsedTime;
    g.position.y = position[1] + Math.sin(t * 0.8) * 0.06;
    g.rotation.z = Math.sin(t * 0.6) * 0.015;
  });
  return (
    <Group3D ref={ref} position={position} rotation={[0, rotationY, 0]}>
      <Part c={HULL} p={[0, 0.4, 0]} s={[2.6, 0.8, 8.4]} />
      <Part c={HULL} p={[0, 0.85, 4.6]} s={[2.2, 0.5, 1.8]} r={[-0.35, 0, 0]} />
      <Part c={HULL} p={[0, 0.85, -4.6]} s={[2.2, 0.5, 1.8]} r={[0.35, 0, 0]} />
      <Part c="#8A5A35" p={[0, 0.86, 0]} s={[2.4, 0.12, 8]} />
      <Part c="#3B2A1E" p={[0, 1.3, 0]} s={[2.2, 0.8, 5.6]} />
      <Mesh3D
        geometry={GEO.halfCyl}
        material={lambert('#C9A15C', { doubleSide: true })}
        position={[0, 1.7, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.35, 6.4, 1.1]} />
      
      <Part g="ico" c="#FFD58A" glow p={[0, 1.35, 2.85]} s={0.18} />
    </Group3D>);

}