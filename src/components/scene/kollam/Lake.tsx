import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '../engine/hooks';
import { Group3D, Mesh3D } from '../engine/objects';
import { basic, lambert } from '../core/materials';
import { isShown } from '../core/isShown';
import { device } from '../../../utils/device';

/** Ashtamudi Lake: one segmented plane with gentle vertex waves. */
export function Lake() {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.PlaneGeometry(64, 70, 40, 40), []);
  const glintGeo = useMemo(() => new THREE.PlaneGeometry(2.6, 52), []);
  const base = useMemo(() => Float32Array.from(geo.attributes.position.array as Float32Array), [geo]);

  const apply = (t: number) => {
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = base[i];
      const y = base[i + 1];
      arr[i + 2] = Math.sin(x * 0.35 + t * 0.9) * 0.12 + Math.cos(y * 0.28 + t * 0.7) * 0.1;
    }
    attr.needsUpdate = true;
  };

  useLayoutEffect(() => {
    apply(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state) => {
    if (device.reducedMotion || !isShown(ref.current)) return;
    apply(state.clock.elapsedTime);
  });

  return (
    <Group3D>
      <Mesh3D ref={ref} geometry={geo} material={lambert('#7F86C2')} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, -29.5]} />
      <Mesh3D
        geometry={glintGeo}
        material={basic('#FFD6B0', { transparent: true, opacity: 0.35 })}
        rotation={[-Math.PI / 2, 0, -0.32]}
        position={[-6, -0.04, -36]} />
      
    </Group3D>);

}