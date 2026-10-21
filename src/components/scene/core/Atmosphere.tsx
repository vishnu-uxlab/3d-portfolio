import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '../engine/hooks';
import { Mesh3D, Primitive3D } from '../engine/objects';
import { lerp, remap, smooth } from '../../../utils/progress';
import type { ScrollRef, V3 } from '../../../types/scroll';

type PaletteKey = {
  p: number;
  top: string;
  bottom: string;
  sun: string;
  sunI: number;
  hemiSky: string;
  hemiGround: string;
  hemiI: number;
  near: number;
  far: number;
  dir: V3;
  discO: number;
};

// Sunset over Kollam, bright day on the village road, gold at the lamp, then Chennai.
const PALETTE: PaletteKey[] = [
{ p: 0, top: '#8E86C7', bottom: '#F6B38E', sun: '#FFB27A', sunI: 2.6, hemiSky: '#E88FA0', hemiGround: '#6F5A8E', hemiI: 1.9, near: 35, far: 200, dir: [-0.35, 0.14, -1], discO: 1 },
{ p: 0.27, top: '#9387C6', bottom: '#F3A98F', sun: '#FFAE7A', sunI: 2.6, hemiSky: '#EC9AA8', hemiGround: '#735E8C', hemiI: 1.9, near: 30, far: 175, dir: [-0.3, 0.14, -1], discO: 1 },
{ p: 0.34, top: '#6EB6F2', bottom: '#C9EBFC', sun: '#FFF6E4', sunI: 2.5, hemiSky: '#E5F3FF', hemiGround: '#6EAA4C', hemiI: 1.45, near: 70, far: 340, dir: [0.4, 0.92, 0.2], discO: 0 },
{ p: 0.5, top: '#6EB6F2', bottom: '#C9EBFC', sun: '#FFF6E4', sunI: 2.5, hemiSky: '#E5F3FF', hemiGround: '#6EAA4C', hemiI: 1.45, near: 70, far: 340, dir: [0.35, 0.9, 0.15], discO: 0 },
{ p: 0.56, top: '#F4C46B', bottom: '#FBE3B0', sun: '#FFD38A', sunI: 2.4, hemiSky: '#FFE6B5', hemiGround: '#B9845A', hemiI: 1.9, near: 22, far: 165, dir: [-0.2, 0.2, -1], discO: 1 },
{ p: 0.78, top: '#F2B866', bottom: '#FBE3B0', sun: '#FFCB80', sunI: 2.4, hemiSky: '#FFE2B0', hemiGround: '#B98A60', hemiI: 1.9, near: 45, far: 285, dir: [-0.2, 0.16, -1], discO: 1 },
{ p: 0.88, top: '#5FA8E8', bottom: '#CFE7F7', sun: '#FFF7EA', sunI: 2.6, hemiSky: '#D8ECFA', hemiGround: '#A0937C', hemiI: 1.8, near: 80, far: 380, dir: [0.4, 0.85, 0.3], discO: 0 },
{ p: 1, top: '#5FA8E8', bottom: '#CFE7F7', sun: '#FFF7EA', sunI: 2.6, hemiSky: '#D8ECFA', hemiGround: '#A0937C', hemiI: 1.8, near: 80, far: 380, dir: [0.4, 0.85, 0.3], discO: 0 }];


const vertexShader = /* glsl */`
  varying vec3 vDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vDir = wp.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */`
  uniform vec3 top;
  uniform vec3 bottom;
  varying vec3 vDir;
  void main() {
    float h = smoothstep(-0.15, 0.55, normalize(vDir).y);
    gl_FragColor = vec4(mix(bottom, top, h), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function Atmosphere({ scroll }: {scroll: ScrollRef;}) {
  const { scene } = useThree();
  const sky = useRef<THREE.Mesh>(null);
  const disc = useRef<THREE.Mesh>(null);
  const lights = useMemo(
    () => ({
      sun: new THREE.DirectionalLight('#FFB27A', 2.6),
      hemi: new THREE.HemisphereLight('#E88FA0', '#6F5A8E', 1.9),
      skyGeo: new THREE.SphereGeometry(900, 32, 16),
      discGeo: new THREE.SphereGeometry(32, 24, 12)
    }),
    []
  );
  const sun = useRef<THREE.DirectionalLight>(lights.sun);
  const hemi = useRef<THREE.HemisphereLight>(lights.hemi);

  const keys = useMemo(
    () =>
    PALETTE.map((k) => ({
      ...k,
      topC: new THREE.Color(k.top),
      bottomC: new THREE.Color(k.bottom),
      sunC: new THREE.Color(k.sun),
      hemiSkyC: new THREE.Color(k.hemiSky),
      hemiGroundC: new THREE.Color(k.hemiGround),
      dirV: new THREE.Vector3(...k.dir).normalize()
    })),
    []
  );

  const skyMat = useMemo(
    () =>
    new THREE.ShaderMaterial({
      uniforms: { top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() } },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false
    }),
    []
  );
  const discMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#FFE2B8', fog: false, transparent: true }), []);
  const fog = useMemo(() => new THREE.Fog('#F0A894', 35, 200), []);
  const tmp = useMemo(() => ({ dir: new THREE.Vector3(), warmWhite: new THREE.Color('#FFF3DA') }), []);

  useLayoutEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  useFrame(({ camera }) => {
    const p = scroll.current.progress;
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1].p) i++;
    const a = keys[i];
    const b = keys[i + 1];
    const f = smooth(remap(p, a.p, b.p));

    const top = skyMat.uniforms.top.value as THREE.Color;
    const bottom = skyMat.uniforms.bottom.value as THREE.Color;
    top.lerpColors(a.topC, b.topC, f);
    bottom.lerpColors(a.bottomC, b.bottomC, f);
    fog.color.lerpColors(bottom, top, 0.12);
    fog.near = lerp(a.near, b.near, f);
    fog.far = lerp(a.far, b.far, f);

    tmp.dir.lerpVectors(a.dirV, b.dirV, f).normalize();
    if (sun.current) {
      sun.current.color.lerpColors(a.sunC, b.sunC, f);
      sun.current.intensity = lerp(a.sunI, b.sunI, f);
      sun.current.position.copy(tmp.dir).multiplyScalar(100);
    }
    if (hemi.current) {
      hemi.current.color.lerpColors(a.hemiSkyC, b.hemiSkyC, f);
      hemi.current.groundColor.lerpColors(a.hemiGroundC, b.hemiGroundC, f);
      hemi.current.intensity = lerp(a.hemiI, b.hemiI, f);
    }
    if (sky.current) sky.current.position.copy(camera.position);
    if (disc.current) {
      disc.current.position.copy(camera.position).addScaledVector(tmp.dir, 700);
      discMat.opacity = lerp(a.discO, b.discO, f);
      discMat.color.lerpColors(bottom, tmp.warmWhite, 0.75);
      disc.current.visible = discMat.opacity > 0.01;
    }
  });

  return (
    <>
      <Mesh3D ref={sky} geometry={lights.skyGeo} material={skyMat} renderOrder={-1} frustumCulled={false} />
      <Mesh3D ref={disc} geometry={lights.discGeo} material={discMat} frustumCulled={false} />
      <Primitive3D object={lights.sun} />
      <Primitive3D object={lights.hemi} />
    </>);

}