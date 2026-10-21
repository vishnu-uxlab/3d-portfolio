import React, { forwardRef } from 'react';
import type { BufferGeometry, Mesh } from 'three';
import { Mesh3D } from '../engine/objects';
import { GEO, basic, lambert, type GeoName } from './materials';
import type { V3 } from '../../../types/scroll';

export type PartProps = {
  g?: GeoName;
  geometry?: BufferGeometry;
  c: string;
  p?: V3;
  s?: V3 | number;
  r?: V3;
  glow?: boolean;
  opacity?: number;
  doubleSide?: boolean;
  /** Pulls this surface toward the camera so it wins against a coplanar ground. */
  offset?: boolean;
};

/** A single primitive mesh using the shared geometry + material caches. */
export const Part = forwardRef<Mesh, PartProps>(function Part(
{ g = 'box', geometry, c, p, s, r, glow, opacity, doubleSide, offset },
ref)
{
  const opts = { transparent: opacity !== undefined && opacity < 1, opacity, doubleSide, offset };
  const material = glow ? basic(c, opts) : lambert(c, opts);
  return <Mesh3D ref={ref} geometry={geometry ?? GEO[g]} material={material} position={p} scale={s} rotation={r} />;
});