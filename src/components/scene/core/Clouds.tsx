import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '../engine/hooks';
import { Instanced3D } from '../engine/objects';
import { GEO } from './materials';
import { isShown } from './isShown';
import { device } from '../../../utils/device';
import { between, mulberry32, pick } from '../../../utils/random';
import { smoothRemap } from '../../../utils/progress';
import type { ScrollRef } from '../../../types/scroll';

type Puff = {x: number;y: number;z: number;s: number;phase: number;color: string;};

type CloudsProps = {
  count: number;
  seed: number;
  area: {x: [number, number];y: [number, number];z: [number, number];};
  cluster?: number;
  scale: [number, number];
  flatten?: number;
  colors: string[];
  opacity?: number;
  /** Flat white clouds, so sky light does not tint them. */
  unlit?: boolean;
  drift?: number;
  fade?: {scroll: ScrollRef;range: [number, number];};
  avoid?: (x: number, y: number, z: number) => boolean;
};

/** Puffy low-poly clouds in one InstancedMesh, grouped into clusters that drift together. */
export function Clouds({ count, seed, area, cluster = 1, scale, flatten = 0.75, colors, opacity = 1, unlit = false, drift = 0, fade, avoid }: CloudsProps) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const puffs = useMemo(() => {
    const rand = mulberry32(seed);
    const n = Math.max(1, Math.round(count * (device.isMobile ? 0.5 : 1)));
    const out: Puff[] = [];
    let guard = 0;
    while (out.length < n && guard < n * 20) {
      guard++;
      const cx = between(rand, area.x[0], area.x[1]);
      const cy = between(rand, area.y[0], area.y[1]);
      const cz = between(rand, area.z[0], area.z[1]);
      const phase = rand() * Math.PI * 2;
      const r = scale[1] * 1.1;
      for (let j = 0; j < cluster && out.length < n; j++) {
        const x = cx + (rand() * 2 - 1) * r * (cluster > 1 ? 1.4 : 0);
        const y = cy + (rand() * 2 - 1) * r * (cluster > 1 ? 0.35 : 0);
        const z = cz + (rand() * 2 - 1) * r * (cluster > 1 ? 0.8 : 0);
        if (avoid && avoid(x, y, z)) continue;
        const s = between(rand, scale[0], scale[1]) * (j === 0 ? 1.15 : 1);
        out.push({ x, y, z, s, phase, color: pick(rand, colors) });
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const material = useMemo(
    () =>
    unlit ?
    new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: opacity < 1 || !!fade,
      opacity
    }) :
    new THREE.MeshLambertMaterial({
      color: '#ffffff',
      flatShading: true,
      transparent: opacity < 1 || !!fade,
      opacity
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const write = (t: number) => {
    const mesh = ref.current;
    if (!mesh) return;
    puffs.forEach((pf, i) => {
      dummy.position.set(pf.x + Math.sin(t * 0.05 + pf.phase) * drift, pf.y + Math.sin(t * 0.25 + pf.phase) * 0.15 * drift, pf.z);
      dummy.scale.set(pf.s, pf.s * flatten, pf.s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const col = new THREE.Color();
    puffs.forEach((pf, i) => mesh.setColorAt(i, col.set(pf.color)));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    write(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puffs]);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh || !isShown(mesh.parent)) return;
    if (fade) {
      const p = fade.scroll.current.progress;
      material.opacity = opacity * (1 - smoothRemap(p, fade.range[0], fade.range[1]));
      mesh.visible = material.opacity > 0.01;
    }
    if (drift > 0 && !device.reducedMotion) write(state.clock.elapsedTime);
  });

  return <Instanced3D ref={ref} args={[GEO.puff, material, puffs.length]} frustumCulled={false} />;
}