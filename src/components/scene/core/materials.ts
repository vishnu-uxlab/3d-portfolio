import * as THREE from 'three';

type MatOpts = {transparent?: boolean;opacity?: number;doubleSide?: boolean;offset?: boolean;};

const cache = new Map<string, THREE.Material>();

function key(kind: string, color: string, o: MatOpts) {
  return `${kind}|${color}|${o.transparent ? 1 : 0}|${o.opacity ?? 1}|${o.doubleSide ? 1 : 0}|${o.offset ? 1 : 0}`;
}

/** Cached flat-shaded Lambert material — created once, reused everywhere. */
export function lambert(color: string, o: MatOpts = {}) {
  const k = key('l', color, o);
  let m = cache.get(k) as THREE.MeshLambertMaterial | undefined;
  if (!m) {
    m = new THREE.MeshLambertMaterial({
      color,
      flatShading: true,
      transparent: !!o.transparent,
      opacity: o.opacity ?? 1,
      side: o.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
      polygonOffset: !!o.offset,
      polygonOffsetFactor: o.offset ? -2 : 0,
      polygonOffsetUnits: o.offset ? -4 : 0
    });
    cache.set(k, m);
  }
  return m;
}

/** Cached unlit material for glowing things. */
export function basic(color: string, o: MatOpts = {}) {
  const k = key('b', color, o);
  let m = cache.get(k) as THREE.MeshBasicMaterial | undefined;
  if (!m) {
    m = new THREE.MeshBasicMaterial({
      color,
      transparent: !!o.transparent,
      opacity: o.opacity ?? 1,
      side: o.doubleSide ? THREE.DoubleSide : THREE.FrontSide
    });
    cache.set(k, m);
  }
  return m;
}

export const GEO = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 12),
  cyl6: new THREE.CylinderGeometry(0.5, 0.5, 1, 6),
  disc: new THREE.CylinderGeometry(0.5, 0.5, 1, 24),
  cone4: new THREE.ConeGeometry(0.5, 1, 4),
  cone8: new THREE.ConeGeometry(0.5, 1, 8),
  pyramid: new THREE.ConeGeometry(0.5 * Math.SQRT2, 1, 4).rotateY(Math.PI / 4),
  ico: new THREE.IcosahedronGeometry(0.5, 1),
  ico0: new THREE.IcosahedronGeometry(0.5, 0),
  puff: new THREE.IcosahedronGeometry(1, 1),
  trunk: new THREE.CylinderGeometry(0.14, 0.24, 1, 6),
  plane: new THREE.PlaneGeometry(1, 1),
  hemi: new THREE.SphereGeometry(0.5, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2),
  halfCyl: new THREE.CylinderGeometry(1, 1, 1, 10, 1, false, -Math.PI / 2, Math.PI),
  halfCylOpen: new THREE.CylinderGeometry(1, 1, 1, 12, 1, true, -Math.PI / 2, Math.PI),
  archRing: new THREE.TorusGeometry(1, 0.09, 4, 14, Math.PI)
};

export type GeoName = keyof typeof GEO;