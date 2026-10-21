import React, { useRef, type ReactNode } from 'react';
import type { Group } from 'three';
import { useFrame } from '../engine/hooks';
import { Group3D } from '../engine/objects';
import type { Range } from '../../../utils/journey';
import type { ScrollRef } from '../../../types/scroll';

type Props = {scroll: ScrollRef;range: Range;children: ReactNode;};

/** Hides its whole subtree when progress is outside `range`. */
export function SceneGroup({ scroll, range, children }: Props) {
  const ref = useRef<Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const p = scroll.current.progress;
    g.visible = p >= range[0] && p <= range[1];
  });
  return <Group3D ref={ref}>{children}</Group3D>;
}