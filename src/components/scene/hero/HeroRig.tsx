import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '../engine/hooks';
import { Group3D } from '../engine/objects';
import { Character, type Limbs } from './Character';
import { Scooter } from './Scooter';
import {
  FALL_END,
  FALL_START,
  LAND_POS,
  RIDE_END,
  RIDE_START,
  ROAD_LENGTH,
  fallPosition,
  rideState,
  rideTurn } from
'../../../utils/journey';
import { remap } from '../../../utils/progress';
import { device } from '../../../utils/device';
import type { ScrollRef } from '../../../types/scroll';

type PoseName = 'idle' | 'ride' | 'sky' | 'land' | 'wave';
type Pose = {
  pivotX: number;
  armLx: number;
  armLz: number;
  armRx: number;
  armRz: number;
  legLx: number;
  legLz: number;
  legRx: number;
  legRz: number;
};

const POSES: Record<PoseName, Pose> = {
  idle: { pivotX: 0, armLx: 0.05, armLz: 0.12, armRx: 0.05, armRz: -0.12, legLx: 0, legLz: 0, legRx: 0, legRz: 0 },
  ride: { pivotX: 0.22, armLx: -1.15, armLz: 0.15, armRx: -1.15, armRz: -0.15, legLx: -1.35, legLz: 0.12, legRx: -1.35, legRz: -0.12 },
  sky: { pivotX: Math.PI / 2, armLx: 0, armLz: 2.0, armRx: 0, armRz: -2.0, legLx: 0.35, legLz: 0.35, legRx: 0.35, legRz: -0.35 },
  land: { pivotX: 0.1, armLx: -0.3, armLz: 1.1, armRx: -0.3, armRz: -1.1, legLx: -0.1, legLz: 0.08, legRx: 0.1, legRz: -0.08 },
  wave: { pivotX: 0, armLx: 0.05, armLz: 0.12, armRx: 0, armRz: -2.7, legLx: 0, legLz: 0, legRx: 0, legRz: 0 }
};
const POSE_KEYS = Object.keys(POSES.idle) as (keyof Pose)[];

/** The traveller and the scooter, placed and posed along the whole journey by scroll progress. */
export function HeroRig({ scroll }: {scroll: ScrollRef;}) {
  const charRef = useRef<THREE.Group>(null);
  const scooterRef = useRef<THREE.Group>(null);
  const leanRef = useRef<THREE.Group>(null);
  const seatRef = useRef<THREE.Group>(null);
  const limbs = useRef<Limbs>({ pivot: null, armL: null, armR: null, legL: null, legR: null });
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const current = useRef<Pose>({ ...POSES.idle });
  const tmp = useMemo(
    () => ({ pos: new THREE.Vector3(), tan: new THREE.Vector3(), look: new THREE.Vector3(), prevU: 0, wave: 0 }),
    []
  );

  useFrame((state, dt) => {
    const char = charRef.current;
    const scooter = scooterRef.current;
    const lean = leanRef.current;
    const seat = seatRef.current;
    const L = limbs.current;
    if (!char || !scooter || !lean || !seat || !L.pivot || !L.armL || !L.armR || !L.legL || !L.legR) return;

    const p = scroll.current.progress;
    const t = device.reducedMotion ? p * 40 : state.clock.elapsedTime;
    const step = Math.min(dt, 0.1);

    // Scooter along the road
    const u = rideState(p, tmp.pos, tmp.tan);
    scooter.visible = p < 0.6;
    scooter.position.copy(tmp.pos);
    tmp.look.copy(tmp.pos).add(tmp.tan);
    scooter.lookAt(tmp.look);
    const riding = p > RIDE_START && p < RIDE_END;
    const targetLean = riding ? THREE.MathUtils.clamp(-rideTurn(u) * 1.6, -0.3, 0.3) : 0;
    lean.rotation.z += (targetLean - lean.rotation.z) * Math.min(1, step * 6);
    const spin = (u - tmp.prevU) * ROAD_LENGTH / 0.22;
    tmp.prevU = u;
    wheels.current.forEach((w) => {
      if (w) w.rotation.x += spin;
    });

    // Character placement + pose
    let pose: PoseName = 'idle';
    char.visible = true;
    char.scale.set(1, 1, 1);

    if (p < 0.12) {
      char.position.set(5, 0, 8);
      char.rotation.set(0, Math.PI, 0);
    } else if (p < RIDE_START) {
      char.position.set(2.5, 0, -73.4);
      char.rotation.set(0, -0.5, 0);
      pose = p > 0.185 && p < 0.25 ? 'wave' : 'idle';
    } else if (p < 0.56) {
      scooter.updateMatrixWorld(true);
      seat.getWorldPosition(char.position);
      seat.getWorldQuaternion(char.quaternion);
      pose = 'ride';
    } else if (p < FALL_START) {
      char.visible = false;
    } else if (p < FALL_END) {
      fallPosition(p, char.position);
      char.rotation.set(0, Math.PI + Math.sin(t * 0.8) * 0.08, 0);
      pose = remap(p, FALL_START, FALL_END) > 0.88 ? 'land' : 'sky';
    } else {
      const k = remap(p, FALL_END, FALL_END + 0.014);
      char.position.set(LAND_POS.x, LAND_POS.y + Math.sin(k * Math.PI) * 0.45 * (1 - k), LAND_POS.z);
      char.rotation.set(0, 0, 0);
      const squash = Math.max(0, 1 - k * 4);
      char.scale.set(1 + squash * 0.08, 1 - squash * 0.15, 1 + squash * 0.08);
      pose = p < FALL_END + 0.012 ? 'land' : 'wave';
    }

    const target = POSES[pose];
    const c = current.current;
    const kk = 1 - Math.exp(-step * 9);
    POSE_KEYS.forEach((key) => {
      c[key] += (target[key] - c[key]) * kk;
    });
    tmp.wave += ((pose === 'wave' ? 1 : 0) - tmp.wave) * kk;

    const idleAmt = pose === 'idle' ? 1 : 0;
    const flutter = pose === 'sky' ? Math.sin(t * 14) * 0.05 : 0;
    L.pivot.rotation.set(c.pivotX, 0, Math.sin(t * 1.4) * 0.025 * idleAmt);
    L.armL.rotation.set(c.armLx + Math.sin(t * 1.4) * 0.05 * idleAmt, 0, c.armLz + flutter);
    L.armR.rotation.set(c.armRx - Math.sin(t * 1.4) * 0.05 * idleAmt, 0, c.armRz + Math.sin(t * 8) * 0.32 * tmp.wave - flutter);
    L.legL.rotation.set(c.legLx, 0, c.legLz);
    L.legR.rotation.set(c.legRx, 0, c.legRz);
  });

  return (
    <>
      <Group3D ref={scooterRef}>
        <Group3D ref={leanRef}>
          <Scooter wheels={wheels} />
          <Group3D ref={seatRef} position={[0, 0.04, -0.32]} />
        </Group3D>
      </Group3D>
      <Group3D ref={charRef}>
        <Character limbs={limbs} />
      </Group3D>
    </>);

}