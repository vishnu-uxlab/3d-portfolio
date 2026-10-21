import { createContext, type MutableRefObject } from 'react';
import type { Clock, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export type FrameState = {
  gl: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  clock: Clock;
};

export type FrameCallback = (state: FrameState, delta: number) => void;

export type Engine = FrameState & {
  subscribe: (cb: MutableRefObject<FrameCallback>, priority: number) => () => void;
};

export const EngineContext = createContext<Engine | null>(null);

/** The Object3D that child scene components attach themselves to. */
export const ParentContext = createContext<Object3D | null>(null);