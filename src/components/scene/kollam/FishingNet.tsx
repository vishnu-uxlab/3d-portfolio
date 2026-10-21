import React from 'react';
import { Part } from '../core/Part';
import { Beam } from '../core/Beam';
import { Group3D } from '../engine/objects';
import type { V3 } from '../../../types/scroll';

const WOOD = '#7A5634';
const WOOD_DARK = '#5A3E26';
const ROPE = '#3A3030';

/** Chinese fishing net: pole frame leaning over the water with a hanging net. Reaches toward local -x. */
export function FishingNet({ position, rotationY = 0 }: {position: V3;rotationY?: number;}) {
  const tip: V3 = [-9.1, 9.5, 0];
  const netY = 1.0;
  const half = 3;
  const corners: V3[] = [
  [tip[0] - half, netY, -half],
  [tip[0] + half, netY, -half],
  [tip[0] + half, netY, half],
  [tip[0] - half, netY, half]];

  return (
    <Group3D position={position} rotation={[0, rotationY, 0]}>
      <Part c={WOOD_DARK} p={[0, 0.25, 0]} s={[3.2, 0.5, 2.6]} />
      <Part g="cyl6" c={WOOD} p={[0.6, 2, 0]} s={[0.16, 3.5, 0.16]} />
      <Beam from={[1.2, 0.5, -0.8]} to={[tip[0], tip[1], -0.15]} radius={0.08} c={WOOD} />
      <Beam from={[1.2, 0.5, 0.8]} to={[tip[0], tip[1], 0.15]} radius={0.08} c={WOOD} />
      <Beam from={[0.6, 3.75, 0]} to={[-4.2, 5.2, 0]} radius={0.03} c={ROPE} />
      <Beam from={tip} to={[tip[0], netY, 0]} radius={0.025} c={ROPE} />
      {corners.map((c, i) =>
      <Beam key={i} from={tip} to={c} radius={0.02} c={ROPE} />
      )}
      <Beam from={corners[0]} to={corners[2]} radius={0.05} c={WOOD} />
      <Beam from={corners[1]} to={corners[3]} radius={0.05} c={WOOD} />
      <Part g="plane" c="#2E2A3A" opacity={0.45} doubleSide p={[tip[0], netY, 0]} s={[half * 2, half * 2, 1]} r={[-Math.PI / 2, 0, 0]} />
    </Group3D>);

}