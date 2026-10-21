import React, { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { Instanced3D } from '../engine/objects';
import type { V3 } from '../../../types/scroll';

export type InstanceItem = {p: V3;s?: V3 | number;r?: V3;c?: string;};

type Props = {items: InstanceItem[];geometry: THREE.BufferGeometry;material: THREE.Material;};

/** Static instanced mesh: one draw call for many repeated parts. Rotation order is YXZ. */
export function InstancedItems({ items, geometry, material }: Props) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    o.rotation.order = 'YXZ';
    const col = new THREE.Color();
    items.forEach((it, i) => {
      o.position.set(it.p[0], it.p[1], it.p[2]);
      if (it.r) o.rotation.set(it.r[0], it.r[1], it.r[2]);else
      o.rotation.set(0, 0, 0);
      const s = it.s ?? 1;
      if (typeof s === 'number') o.scale.setScalar(s);else
      o.scale.set(s[0], s[1], s[2]);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      if (it.c) mesh.setColorAt(i, col.set(it.c));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  if (items.length === 0) return null;
  return <Instanced3D key={items.length} ref={ref} args={[geometry, material, items.length]} frustumCulled={false} />;
}