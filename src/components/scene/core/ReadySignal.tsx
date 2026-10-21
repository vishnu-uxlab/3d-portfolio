import { useRef } from 'react';
import { useFrame } from '../engine/hooks';

/** Reports ready after a few rendered frames. */
export function ReadySignal({ onReady }: {onReady: () => void;}) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current++;
    if (frames.current > 3) {
      done.current = true;
      onReady();
    }
  });
  return null;
}