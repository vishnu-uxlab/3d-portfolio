import React, { forwardRef, useContext, useImperativeHandle, useLayoutEffect, useState, type ForwardedRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { ParentContext } from './EngineContext';
import type { V3 } from '../../../types/scroll';

export type ObjProps = {
  position?: V3 | THREE.Vector3;
  rotation?: V3;
  scale?: V3 | number;
  quaternion?: THREE.Quaternion;
  visible?: boolean;
  renderOrder?: number;
  frustumCulled?: boolean;
  children?: ReactNode;
};

function applyTransform(o: THREE.Object3D, p: ObjProps) {
  if (p.position) {
    if (p.position instanceof THREE.Vector3) o.position.copy(p.position);else
    o.position.set(p.position[0], p.position[1], p.position[2]);
  }
  if (p.rotation) o.rotation.set(p.rotation[0], p.rotation[1], p.rotation[2]);
  if (p.quaternion) o.quaternion.copy(p.quaternion);
  if (p.scale !== undefined) {
    if (typeof p.scale === 'number') o.scale.setScalar(p.scale);else
    o.scale.set(p.scale[0], p.scale[1], p.scale[2]);
  }
  if (p.visible !== undefined) o.visible = p.visible;
  if (p.renderOrder !== undefined) o.renderOrder = p.renderOrder;
  if (p.frustumCulled !== undefined) o.frustumCulled = p.frustumCulled;
}

/** Adds `object` to the nearest parent, keeps transform props applied, and exposes it via ref. */
function useAttach<T extends THREE.Object3D>(object: T, props: ObjProps, ref: ForwardedRef<T>) {
  const parent = useContext(ParentContext);
  useImperativeHandle(ref, () => object, [object]);
  useLayoutEffect(() => {
    applyTransform(object, props);
  });
  useLayoutEffect(() => {
    if (!parent) return;
    parent.add(object);
    return () => {
      parent.remove(object);
    };
  }, [parent, object]);
}

export const Group3D = forwardRef<THREE.Group, ObjProps>(function Group3D(props, ref) {
  const [obj] = useState(() => new THREE.Group());
  useAttach(obj, props, ref);
  return <ParentContext.Provider value={obj}>{props.children}</ParentContext.Provider>;
});

type MeshProps = ObjProps & {geometry?: THREE.BufferGeometry;material?: THREE.Material;};

export const Mesh3D = forwardRef<THREE.Mesh, MeshProps>(function Mesh3D(props, ref) {
  const [obj] = useState(() => new THREE.Mesh(props.geometry, props.material));
  useLayoutEffect(() => {
    if (props.geometry) obj.geometry = props.geometry;
    if (props.material) obj.material = props.material;
  }, [obj, props.geometry, props.material]);
  useAttach(obj, props, ref);
  return null;
});

type InstancedProps = ObjProps & {args: [THREE.BufferGeometry, THREE.Material, number];};

/** Instanced mesh; the instance count is fixed at creation (remount with a `key` to change it). */
export const Instanced3D = forwardRef<THREE.InstancedMesh, InstancedProps>(function Instanced3D(props, ref) {
  const [obj] = useState(() => new THREE.InstancedMesh(props.args[0], props.args[1], props.args[2]));
  useAttach(obj, props, ref);
  return null;
});

type PrimitiveProps = ObjProps & {object: THREE.Object3D;};

/** Attaches an existing Object3D (e.g. a light) to the scene graph. */
export function Primitive3D(props: PrimitiveProps) {
  useAttach(props.object, props, null);
  return <ParentContext.Provider value={props.object}>{props.children}</ParentContext.Provider>;
}