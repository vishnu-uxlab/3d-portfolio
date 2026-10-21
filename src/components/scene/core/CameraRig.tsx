import { useMemo } from 'react';
import { useFrame, useThree } from '../engine/hooks';
import * as THREE from 'three';
import { CAMERA_KEYS, LAMP_POS, fallPosition, rideState } from '../../../utils/journey';
import { band, lerp, remap } from '../../../utils/progress';
import { device } from '../../../utils/device';
import type { ScrollRef } from '../../../types/scroll';

const MAX_PARALLAX = THREE.MathUtils.degToRad(2);

function keyParam(p: number) {
  const n = CAMERA_KEYS.length;
  if (p <= CAMERA_KEYS[0].p) return 0;
  for (let i = 0; i < n - 1; i++) {
    const a = CAMERA_KEYS[i];
    const b = CAMERA_KEYS[i + 1];
    if (p <= b.p) return (i + (p - a.p) / (b.p - a.p)) / (n - 1);
  }
  return 1;
}

/** Moves the camera along the position curve, looking at the target curve, with scene-specific overrides. */
export function CameraRig({ scroll }: {scroll: ScrollRef;}) {
  const { camera } = useThree();
  const curves = useMemo(
    () => ({
      pos: new THREE.CatmullRomCurve3(CAMERA_KEYS.map((k) => new THREE.Vector3(...k.pos)), false, 'centripetal'),
      tgt: new THREE.CatmullRomCurve3(CAMERA_KEYS.map((k) => new THREE.Vector3(...k.tgt)), false, 'centripetal')
    }),
    []
  );
  const tmp = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      tgt: new THREE.Vector3(),
      a: new THREE.Vector3(),
      b: new THREE.Vector3(),
      ride: new THREE.Vector3(),
      tan: new THREE.Vector3(),
      mouse: { x: 0, y: 0 }
    }),
    []
  );

  useFrame((state) => {
    const s = scroll.current;
    const p = s.progress;
    const u = keyParam(p);
    curves.pos.getPoint(u, tmp.pos);
    curves.tgt.getPoint(u, tmp.tgt);

    // Skills ride: third-person chase camera
    const wr = band(p, 0.285, 0.505, 0.018);
    if (wr > 0) {
      rideState(p, tmp.ride, tmp.tan);
      tmp.a.copy(tmp.ride).addScaledVector(tmp.tan, -8.5);
      tmp.a.y += 4.2;
      tmp.b.copy(tmp.ride).addScaledVector(tmp.tan, 9);
      tmp.b.y += 1.2;
      tmp.pos.lerp(tmp.a, wr);
      tmp.tgt.lerp(tmp.b, wr);
    }

    // Ascent: circle the brass lamp
    const wl = band(p, 0.568, 0.598, 0.01);
    if (wl > 0) {
      const k = remap(p, 0.558, 0.608);
      const ang = lerp(0, -Math.PI * 0.6, k);
      tmp.a.set(LAMP_POS.x + Math.sin(ang) * 24, LAMP_POS.y + 8 - k * 2, LAMP_POS.z + Math.cos(ang) * 24);
      tmp.b.set(LAMP_POS.x, LAMP_POS.y + 9, LAMP_POS.z);
      tmp.pos.lerp(tmp.a, wl);
      tmp.tgt.lerp(tmp.b, wl);
    }

    // Skydive: follow from above
    const ws = band(p, 0.8, 0.858, 0.012);
    if (ws > 0) {
      fallPosition(p, tmp.ride);
      tmp.a.copy(tmp.ride);
      tmp.a.y += 7.5;
      tmp.a.z += 4.5;
      tmp.b.copy(tmp.ride);
      tmp.b.y -= 1.5;
      tmp.pos.lerp(tmp.a, ws);
      tmp.tgt.lerp(tmp.b, ws);
    }

    // Gentle drift so the camera never stops dead
    const t = state.clock.elapsedTime;
    const amp = device.reducedMotion ? 0.05 : 0.2;
    const speed = device.reducedMotion ? 0.5 : 1;
    tmp.pos.x += Math.sin(t * 0.37 * speed) * amp;
    tmp.pos.y += Math.sin(t * 0.51 * speed + 1) * amp * 0.6;
    tmp.tgt.x += Math.sin(t * 0.29 * speed + 2) * amp * 0.5;

    camera.position.copy(tmp.pos);
    camera.lookAt(tmp.tgt);

    if (!device.isMobile && device.canHover) {
      const k = device.reducedMotion ? 0.02 : 0.05;
      tmp.mouse.x += (s.mouseX - tmp.mouse.x) * k;
      tmp.mouse.y += (s.mouseY - tmp.mouse.y) * k;
      camera.rotateY(-tmp.mouse.x * MAX_PARALLAX);
      camera.rotateX(-tmp.mouse.y * MAX_PARALLAX);
    }
  }, -1);

  return null;
}