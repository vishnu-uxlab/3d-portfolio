import type { Object3D } from 'three';

/** True when the object and all of its ancestors are visible. */
export function isShown(obj: Object3D | null | undefined) {
  let o: Object3D | null | undefined = obj;
  while (o) {
    if (!o.visible) return false;
    o = o.parent;
  }
  return !!obj;
}