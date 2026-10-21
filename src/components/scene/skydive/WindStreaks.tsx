import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '../engine/hooks';
import { Instanced3D } from '../engine/objects';
import { FALL_END, FALL_START, fallPosition } from '../../../utils/journey';
import { band } from '../../../utils/progress';
import { device } from '../../../utils/device';
import { between, mulberry32 } from '../../../utils/random';
import type { ScrollRef } from '../../../types/scroll';

const SPAN = 26;

/** Thin white streaks rushing upward around the falling character. */
export function WindStreaks({ scroll }: {scroll: ScrollRef;}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const streaks = useMemo(() => {
    const rand = mulberry32(53);
    const n = device.isMobile ? 20 : 40;
    return Array.from({ length: n }, () => ({
      a: rand() * Math.PI * 2,
      r: between(rand, 1.6, 8),
      o: rand() * SPAN,
      len: between(rand, 1.6, 3.4)
    }));
  }, []);
  const geometry = useMemo(() => new THREE.BoxGeometry(0.04, 1, 0.04), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, depthWrite: false }), []);
  const tmp = useMemo(() => ({ c: new THREE.Vector3(), o: new THREE.Object3D() }), []);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const p = scroll.current.progress;
    const w = band(p, FALL_START + 0.004, FALL_END - 0.012, 0.008);
    mesh.visible = w > 0.01;
    if (!mesh.visible) return;
    material.opacity = 0.55 * w;
    fallPosition(p, tmp.c);
    const offset = p * 2400 + (device.reducedMotion ? 0 : state.clock.elapsedTime * 18);
    streaks.forEach((s, i) => {
      const y = (s.o + offset) % SPAN - 10;
      tmp.o.position.set(tmp.c.x + Math.cos(s.a) * s.r, tmp.c.y + y, tmp.c.z + Math.sin(s.a) * s.r);
      tmp.o.scale.set(1, s.len * w, 1);
      tmp.o.updateMatrix();
      mesh.setMatrixAt(i, tmp.o.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return <Instanced3D ref={ref} args={[geometry, material, streaks.length]} frustumCulled={false} />;
}