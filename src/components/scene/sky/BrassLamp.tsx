import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '../engine/hooks';
import { Group3D, Mesh3D, Primitive3D } from '../engine/objects';
import { Part } from '../core/Part';
import { lambert } from '../core/materials';
import { isShown } from '../core/isShown';
import { device } from '../../../utils/device';

// Nilavilakku silhouette: wide base, knotted stem, oil bowl and finial
const PROFILE: [number, number][] = [
[0, 0], [3.2, 0], [3.3, 0.35], [2.7, 0.7], [1.4, 1.1], [1.0, 1.6], [1.3, 2.0], [0.6, 2.4],
[0.48, 4.5], [0.85, 5.0], [0.48, 5.5], [0.45, 8.5], [0.9, 9.0], [0.5, 9.5], [0.7, 10.2],
[2.2, 10.9], [3.3, 11.5], [3.5, 11.95], [3.1, 11.9], [1.0, 11.7], [0.5, 11.8], [0.42, 12.6],
[0.75, 13.2], [0.35, 13.9], [0.6, 14.5], [0.25, 15.3], [0, 15.9]];

const FLAMES = 5;

/** Giant golden Kerala brass lamp with five flickering flames. */
export function BrassLamp({ position, scale = 1 }: {position: THREE.Vector3;scale?: number;}) {
  const geo = useMemo(() => new THREE.LatheGeometry(PROFILE.map(([x, y]) => new THREE.Vector2(x, y)), 14), []);
  const light = useMemo(() => new THREE.PointLight('#FFB45A', 40, 60, 1.4), []);
  const flames = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const first = flames.current[0];
    if (device.reducedMotion || !first || !isShown(first.parent)) return;
    const t = state.clock.elapsedTime;
    flames.current.forEach((f, i) => {
      if (!f) return;
      const k = 1 + Math.sin(t * 11 + i * 1.7) * 0.12 + Math.sin(t * 23 + i * 0.6) * 0.06;
      f.scale.set(2 - k, k, 2 - k);
      f.rotation.z = Math.sin(t * 7 + i) * 0.06;
    });
  });

  return (
    <Group3D position={position} scale={scale}>
      <Mesh3D geometry={geo} material={lambert('#D9A43A')} />
      {Array.from({ length: FLAMES }).map((_, i) => {
        const a = i / FLAMES * Math.PI * 2;
        return (
          <Group3D key={i} ref={(g) => flames.current[i] = g} position={[Math.cos(a) * 3.1, 12.05, Math.sin(a) * 3.1]}>
            <Part g="cone8" c="#FF8A1F" glow p={[0, 0.6, 0]} s={[0.55, 1.3, 0.55]} />
            <Part g="cone8" c="#FFE08A" glow p={[0, 0.42, 0]} s={[0.28, 0.75, 0.28]} />
          </Group3D>);

      })}
      <Primitive3D object={light} position={[0, 13, 0]} />
    </Group3D>);

}