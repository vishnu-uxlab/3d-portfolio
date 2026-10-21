import type { MutableRefObject } from 'react';

export type ScrollState = {
  target: number;
  progress: number;
  velocity: number;
  mouseX: number;
  mouseY: number;
  initialized: boolean;
};

export type ScrollRef = MutableRefObject<ScrollState>;

export type V3 = [number, number, number];