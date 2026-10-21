import { useContext, useLayoutEffect, useRef } from 'react';
import { EngineContext, type FrameCallback } from './EngineContext';

export function useThree() {
  const engine = useContext(EngineContext);
  if (!engine) throw new Error('useThree must be used inside <ThreeCanvas>');
  return engine;
}

/** Runs `cb` every frame before rendering. Lower priority runs first. */
export function useFrame(cb: FrameCallback, priority = 0) {
  const engine = useThree();
  const ref = useRef(cb);
  ref.current = cb;
  useLayoutEffect(() => engine.subscribe(ref, priority), [engine, priority]);
}