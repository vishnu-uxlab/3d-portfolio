import React, { useMemo } from 'react';
import * as THREE from 'three';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Group3D, Mesh3D } from '../engine/objects';
import { ROAD_LENGTH, TOWN_CENTER, roadCurve } from '../../../utils/journey';

const WIDTH = 7;
const WALK = 12.4;
const SEGMENTS = 300;
const RING = 19;
const GARDEN = 11.3;

function ribbon(width: number, y: number, u0: number) {
  const steps = Math.max(8, Math.round(SEGMENTS * (1 - u0)));
  const positions: number[] = [];
  const indices: number[] = [];
  const tan = new THREE.Vector3();
  const pos = new THREE.Vector3();
  for (let i = 0; i <= steps; i++) {
    const u = u0 + (1 - u0) * (i / steps);
    roadCurve.getPointAt(u, pos);
    roadCurve.getTangentAt(u, tan);
    const nx = -tan.z;
    const nz = tan.x;
    const half = width * 0.5;
    positions.push(pos.x + nx * half, y, pos.z + nz * half);
    positions.push(pos.x - nx * half, y, pos.z - nz * half);
    if (i < steps) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setIndex(indices);
  g.computeVertexNormals();
  return g;
}

/** Curve parameter after the roundabout where the centreline reaches `radius`. */
function uAtRadius(radius: number) {
  const pos = new THREE.Vector3();
  const radiusAt = (u: number) => {
    roadCurve.getPointAt(u, pos);
    return Math.hypot(pos.x - TOWN_CENTER.x, pos.z - TOWN_CENTER.z);
  };
  let minU = 0;
  let minR = Infinity;
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const r = radiusAt(u);
    if (r < minR) {
      minR = r;
      minU = u;
    }
  }
  for (let i = 0; i <= 200; i++) {
    const u = minU + (1 - minU) * (i / 200);
    if (radiusAt(u) >= radius) return u;
  }
  return minU;
}

/** Winding village road leaving the roundabout on a shared tangent. */
export function Road() {
  const geometry = useMemo(() => {
    const asphaltU = uAtRadius(RING - WIDTH * 0.5);
    const walkU = uAtRadius(GARDEN + WALK * 0.5);
    const edgeU = asphaltU;
    const steps = Math.max(8, Math.round(SEGMENTS * (1 - edgeU)));
    const positions: number[] = [];
    const indices: number[] = [];
    const tan = new THREE.Vector3();
    const pos = new THREE.Vector3();
    const half = 0.08;
    const inset = WIDTH * 0.5 - 0.22;
    for (let i = 0; i <= steps; i++) {
      const u = edgeU + (1 - edgeU) * (i / steps);
      roadCurve.getPointAt(u, pos);
      roadCurve.getTangentAt(u, tan);
      const nx = -tan.z;
      const nz = tan.x;
      [-1, 1].forEach((side) => {
        const c = inset * side;
        positions.push(pos.x + nx * (c + half), 0.115, pos.z + nz * (c + half));
        positions.push(pos.x + nx * (c - half), 0.115, pos.z + nz * (c - half));
      });
      if (i < steps) {
        const a = i * 4;
        [0, 2].forEach((o) => indices.push(a + o, a + o + 1, a + o + 4, a + o + 1, a + o + 5, a + o + 4));
      }
    }
    const edges = new THREE.BufferGeometry();
    edges.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    edges.setIndex(indices);
    edges.computeVertexNormals();

    const dashes: InstanceItem[] = [];
    const dashCount = Math.round(SEGMENTS * (1 - walkU) / 3);
    for (let i = 1; i < dashCount; i++) {
      const u = walkU + (1 - walkU) * (i / dashCount);
      roadCurve.getPointAt(u, pos);
      roadCurve.getTangentAt(u, tan);
      dashes.push({
        p: [pos.x, 0.115, pos.z],
        s: [0.22, 0.02, ROAD_LENGTH / SEGMENTS * 2.1],
        r: [0, Math.atan2(tan.x, tan.z), 0]
      });
    }

    return {
      walk: ribbon(WALK, 0.05, walkU),
      asphalt: ribbon(WIDTH, 0.09, asphaltU),
      edges,
      dashes
    };
  }, []);

  const paint = lambert('#F7F7F4', { offset: true, doubleSide: true });
  return (
    <Group3D>
      <Mesh3D geometry={geometry.walk} material={lambert('#D7DCE2', { offset: true, doubleSide: true })} />
      <Mesh3D geometry={geometry.asphalt} material={lambert('#5C6370', { offset: true, doubleSide: true })} />
      <Mesh3D geometry={geometry.edges} material={paint} />
      <InstancedItems items={geometry.dashes} geometry={GEO.box} material={paint} />
    </Group3D>);

}
