import React, { useMemo } from 'react';
import { GEO, lambert } from './materials';
import { InstancedItems, type InstanceItem } from './InstancedItems';
import { Group3D } from '../engine/objects';
import { voxelCells } from '../../../utils/voxelFont';
import type { V3 } from '../../../types/scroll';

type Props = {text: string;cube: number;color: string;position: V3;rotation?: V3;anchor?: number;};

/** Pixel-font letters built from one InstancedMesh of cubes. */
export function VoxelText({ text, cube, color, position, rotation, anchor }: Props) {
  const items = useMemo<InstanceItem[]>(
    () => voxelCells(text, anchor).map((c) => ({ p: [c.x * cube, c.y * cube + cube / 2, 0], s: [cube * 0.94, cube * 0.94, cube * 1.3] })),
    [text, cube, anchor]
  );
  return (
    <Group3D position={position} rotation={rotation}>
      <InstancedItems items={items} geometry={GEO.box} material={lambert(color)} />
    </Group3D>);

}