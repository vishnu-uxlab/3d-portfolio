import React, { useLayoutEffect, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';
import { EngineContext, ParentContext, type Engine, type FrameCallback } from './EngineContext';
import type { V3 } from '../../../types/scroll';

type Props = {
  dpr: number | [number, number];
  fov: number;
  position: V3;
  clearColor: string;
  children: ReactNode;
};

/** Minimal three.js host: renderer, scene, camera and a priority-sorted frame loop. */
export function ThreeCanvas({ dpr, fov, position, clearColor, children }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<Engine | null>(null);

  useLayoutEffect(() => {
    const el = container.current;
    if (!el) return;
    const gl = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    const ratio = Array.isArray(dpr) ? Math.min(Math.max(dpr[0], window.devicePixelRatio || 1), dpr[1]) : dpr;
    gl.setPixelRatio(ratio);
    gl.setClearColor(clearColor);
    gl.domElement.style.display = 'block';
    el.appendChild(gl.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 1600);
    camera.position.set(position[0], position[1], position[2]);
    const clock = new THREE.Clock();
    const subs: {ref: MutableRefObject<FrameCallback>;priority: number;}[] = [];

    const eng: Engine = {
      gl,
      scene,
      camera,
      clock,
      subscribe(ref, priority) {
        const s = { ref, priority };
        subs.push(s);
        subs.sort((a, b) => a.priority - b.priority);
        return () => {
          const i = subs.indexOf(s);
          if (i >= 0) subs.splice(i, 1);
        };
      }
    };

    const resize = () => {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      gl.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const delta = clock.getDelta();
      for (const s of subs.slice()) s.ref.current(eng, delta);
      gl.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
    setEngine(eng);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.dispose();
      if (gl.domElement.parentNode === el) el.removeChild(gl.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={container} className="absolute inset-0">
      {engine &&
      <EngineContext.Provider value={engine}>
          <ParentContext.Provider value={engine.scene}>{children}</ParentContext.Provider>
        </EngineContext.Provider>
      }
    </div>);

}