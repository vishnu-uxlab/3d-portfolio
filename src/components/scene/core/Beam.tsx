import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Mesh3D } from '../engine/objects';
import { GEO, lambert } from './materials';
import type { V3 } from '../../../types/scroll';

type BeamProps = {from: V3;to: V3;radius?: number;c: string;};

const UP = new THREE.Vector3(0, 1, 0);

/** A thin cylinder stretched between two points (poles, ropes). */
export function Beam({ from, to, radius = 0.05, c }: BeamProps) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const length = dir.length();
    return {
      pos: a.clone().add(b).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(UP, dir.normalize()),
      len: length
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...from, ...to]);
  return <Mesh3D geometry={GEO.cyl6} material={lambert(c)} position={pos} quaternion={quat} scale={[radius * 2, len, radius * 2]} />;
}