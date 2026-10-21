import React, { useMemo } from 'react';
import { Part } from '../core/Part';
import { GEO, lambert } from '../core/materials';
import { InstancedItems, type InstanceItem } from '../core/InstancedItems';
import { Group3D } from '../engine/objects';
import type { V3 } from '../../../types/scroll';

const RED = '#C23B32';
const RED_DARK = '#A32F28';
const ROOF = '#E4E1D8';
const ROOF_EDGE = '#CFCBC0';
const WHITE = '#F7F4EE';
const DARK = '#2A2428';
const FACE = '#FFFEF8';
const TRAIN = '#2E7494';

type Bay = {x: number;y: number;w: number;h: number;z: number;};

/** Chennai Central: red arched hall, clock tower, platform canopy and side trains. Faces +z. */
export function CentralStation({ position }: {position: V3;}) {
  const parts = useMemo(() => {
    const frames: InstanceItem[] = [];
    const panes: InstanceItem[] = [];
    const caps: InstanceItem[] = [];
    const voids: InstanceItem[] = [];
    const crenels: InstanceItem[] = [];
    const posts: InstanceItem[] = [];

    const arch = (bay: Bay) => {
      const { x, y, w, h, z } = bay;
      frames.push({ p: [x, y, z], s: [w + 0.34, h + 0.16, 0.18] });
      panes.push({ p: [x, y - 0.04, z + 0.08], s: [w, h * 0.92, 0.08] });
      const capY = y + h * 0.46;
      caps.push({ p: [x, capY, z + 0.02], s: [w + 0.34, w * 0.62, 0.28] });
      voids.push({ p: [x, capY - 0.02, z + 0.1], s: [w * 0.82, w * 0.46, 0.12] });
    };

    const blocked = (x: number) =>
    Math.abs(x) < 4.8 || Math.abs(Math.abs(x) - 12) < 2.3 || Math.abs(Math.abs(x) - 24) < 3.5;

    for (let i = 0; i < 17; i++) {
      const x = -21.6 + i * 2.7;
      if (blocked(x)) continue;
      arch({ x, y: 6.55, w: 1.05, h: 2.15, z: 4.62 });
      arch({ x, y: 3.05, w: 1.15, h: 2.55, z: 4.62 });
    }
    [-24, 24].forEach((x) => arch({ x, y: 8.4, w: 1.35, h: 3.1, z: 5.12 }));
    [-12, 12].forEach((x) => arch({ x, y: 7.2, w: 1.05, h: 2.4, z: 5.08 }));
    arch({ x: 0, y: 12.4, w: 1.5, h: 3.4, z: 5.32 });

    for (let x = -22.5; x <= 22.5; x += 1.55) {
      if (blocked(x)) continue;
      crenels.push({ p: [x, 9.95, 4.72], s: [0.62, 0.62, 0.4] });
    }
    for (let x = -16; x <= 16; x += 5.3) {
      posts.push({ p: [x, 1.7, 8.55], s: [0.32, 3.2, 0.32] });
    }

    return { frames, panes, caps, voids, crenels, posts };
  }, []);

  const clockFaces: {r: number;p: V3;}[] = [
  { r: 0, p: [0, 18.6, 5.35] },
  { r: Math.PI / 2, p: [3.35, 18.6, 2] },
  { r: -Math.PI / 2, p: [-3.35, 18.6, 2] }];


  return (
    <Group3D position={position}>
      <Part c={WHITE} p={[0, 0.45, 0]} s={[54, 0.9, 10.2]} />
      <Part c={RED} p={[0, 5, 0]} s={[52, 8.2, 9]} />
      <Part c={WHITE} p={[0, 4.55, 4.35]} s={[52.2, 0.28, 0.4]} />
      <Part c={WHITE} p={[0, 9.2, 0]} s={[53.2, 0.45, 10]} />
      <Part c={ROOF_EDGE} p={[0, 9.7, 0]} s={[51.4, 0.28, 8.4]} />
      <Part c={ROOF} p={[0, 10.05, -0.2]} s={[48, 0.4, 7.2]} />

      <InstancedItems items={parts.frames} geometry={GEO.box} material={lambert(WHITE)} />
      <InstancedItems items={parts.panes} geometry={GEO.box} material={lambert(DARK)} />
      <InstancedItems items={parts.caps} geometry={GEO.hemi} material={lambert(WHITE)} />
      <InstancedItems items={parts.voids} geometry={GEO.hemi} material={lambert(DARK)} />
      <InstancedItems items={parts.crenels} geometry={GEO.box} material={lambert(WHITE)} />

      {[-24, 24].map((x) =>
      <Group3D key={x}>
          <Part c={RED} p={[x, 7.2, 2]} s={[6.2, 14.4, 6.2]} />
          <Part c={WHITE} p={[x, 6.2, 2]} s={[6.5, 0.28, 6.5]} />
          <Part c={WHITE} p={[x, 11.2, 2]} s={[6.55, 0.32, 6.55]} />
          <Part c={WHITE} p={[x, 14.4, 2]} s={[6.7, 0.4, 6.7]} />
          <Part c={WHITE} p={[x, 7.2, 5.12]} s={[0.28, 12, 0.2]} />
          <Part g="pyramid" c={ROOF} p={[x, 17.6, 2]} s={[6.2, 5.6, 6.2]} />
          <Part g="pyramid" c={WHITE} p={[x, 20.5, 2]} s={[1.3, 1.5, 1.3]} />
          <Part g="cyl6" c={WHITE} p={[x, 21.6, 2]} s={[0.1, 1.1, 0.1]} />
        </Group3D>
      )}
      {[-12, 12].map((x) =>
      <Group3D key={x}>
          <Part c={RED_DARK} p={[x, 6.4, 3.1]} s={[3.5, 12.6, 3.6]} />
          <Part c={WHITE} p={[x, 10.4, 3.1]} s={[3.8, 0.26, 3.9]} />
          <Part c={WHITE} p={[x, 12.7, 3.1]} s={[3.9, 0.32, 4]} />
          <Part g="pyramid" c={ROOF} p={[x, 14.5, 3.1]} s={[3.6, 3.2, 3.6]} />
          <Part g="cyl6" c={WHITE} p={[x, 16.3, 3.1]} s={[0.08, 0.8, 0.08]} />
        </Group3D>
      )}

      <Part c={RED} p={[0, 12.2, 2]} s={[6.6, 24.4, 6.6]} />
      {[
      [3.15, 5.15],
      [-3.15, 5.15],
      [3.15, -1.15],
      [-3.15, -1.15]].
      map(([x, z]) =>
      <Group3D key={`${x}${z}`}>
          <Part c={WHITE} p={[x, 12.2, z]} s={[0.42, 24.4, 0.42]} />
        </Group3D>
      )}
      {[8.2, 14.6, 16.4, 21.8].map((y) =>
      <Part key={y} c={WHITE} p={[0, y, 2]} s={[7.15, 0.32, 7.15]} />
      )}
      {clockFaces.map((f) =>
      <Group3D key={f.r} position={f.p} rotation={[0, f.r, 0]}>
          <Part g="disc" c={WHITE} s={[4.15, 0.1, 4.15]} r={[Math.PI / 2, 0, 0]} />
          <Part g="disc" c={DARK} p={[0, 0, 0.04]} s={[3.55, 0.08, 3.55]} r={[Math.PI / 2, 0, 0]} />
          <Part g="disc" c={FACE} p={[0, 0, 0.1]} s={[3.15, 0.08, 3.15]} r={[Math.PI / 2, 0, 0]} />
          <Part c={DARK} p={[0.05, 0.45, 0.18]} s={[0.1, 1.05, 0.04]} />
          <Part c={DARK} p={[0.42, -0.02, 0.18]} s={[0.78, 0.1, 0.04]} />
          <Part g="disc" c={DARK} p={[0, 0, 0.2]} s={[0.28, 0.06, 0.28]} r={[Math.PI / 2, 0, 0]} />
        </Group3D>
      )}
      <Part g="pyramid" c={ROOF} p={[0, 26.6, 2]} s={[6.8, 6.4, 6.8]} />
      <Part g="pyramid" c={WHITE} p={[0, 30.2, 2]} s={[1.6, 1.8, 1.6]} />
      <Part g="cyl6" c={WHITE} p={[0, 32.4, 2]} s={[0.12, 2.2, 0.12]} />

      <Part c={WHITE} p={[0, 3.05, 6.15]} s={[8.4, 6.1, 2.2]} />
      <Part c={DARK} p={[0, 2.15, 7.28]} s={[2.6, 3.5, 0.06]} />
      <Part g="hemi" c={DARK} p={[0, 3.85, 7.3]} s={[2.7, 1.35, 0.2]} />
      <Part c={WHITE} p={[-1.7, 2.3, 7.22]} s={[0.28, 4.2, 0.2]} />
      <Part c={WHITE} p={[1.7, 2.3, 7.22]} s={[0.28, 4.2, 0.2]} />

      <Part c={ROOF} p={[0, 3.35, 8.15]} s={[38, 0.28, 4.4]} />
      <InstancedItems items={parts.posts} geometry={GEO.box} material={lambert(WHITE)} />

      {[-33.5, 33.5].map((x) =>
      <Group3D key={x}>
          {[-0.7, 0.7].map((o) =>
        <Part key={o} c="#4A463F" p={[x + o, 0.12, -1]} s={[0.12, 0.08, 22]} />
        )}
          <Part c="#6B6560" p={[x, 0.06, -1]} s={[2.4, 0.06, 22]} />
        </Group3D>
      )}
      <Group3D position={[33.5, 0, 2]}>
        <Part c={TRAIN} p={[0, 2.15, 0]} s={[2.5, 2.5, 12]} />
        <Part c={WHITE} p={[0, 2.35, 0]} s={[2.62, 0.28, 12.1]} />
        <Part c="#D5DEE6" p={[0, 3.55, 0]} s={[2.7, 0.28, 12]} />
        <Part c="#1E4E68" p={[0, 2.5, 6.02]} s={[2.2, 1.3, 0.08]} />
      </Group3D>
      <Group3D position={[-33.5, 0, -6]}>
        <Part c="#E7E4DC" p={[0, 1.7, 0]} s={[2.4, 2.1, 8]} />
        <Part c={RED} p={[0, 1.55, 0]} s={[2.5, 0.35, 8.1]} />
      </Group3D>

      <Part c="#6A6560" p={[0, 0.04, -30]} s={[40, 0.06, 40]} />
      {[
      { x: -16, z: -34, len: 22, body: '#2E7494', band: '#F4F7FA' },
      { x: -8, z: -24, len: 16, body: '#E8E4DA', band: '#C23B32' },
      { x: 0, z: -36, len: 24, body: '#3C8F68', band: '#F7F4EE' },
      { x: 8, z: -26, len: 18, body: '#D4533E', band: '#F6E6C4' },
      { x: 16, z: -33, len: 20, body: '#2E7494', band: '#E4EEF4' }].
      map((train) =>
      <Group3D key={train.x}>
          <Part c="#514C48" p={[train.x, 0.08, -30]} s={[2.6, 0.06, 38]} />
          <Part c="#2C2926" p={[train.x - 0.7, 0.16, -30]} s={[0.1, 0.08, 38]} />
          <Part c="#2C2926" p={[train.x + 0.7, 0.16, -30]} s={[0.1, 0.08, 38]} />
          <Part c={train.body} p={[train.x, 1.35, train.z]} s={[2.15, 2.15, train.len]} />
          <Part c={train.band} p={[train.x, 1.7, train.z]} s={[2.28, 0.28, train.len + 0.1]} />
          <Part c={train.body} p={[train.x, 2.55, train.z]} s={[2.3, 0.22, train.len]} />
          <Part c="#163E52" p={[train.x, 1.55, train.z + train.len / 2]} s={[1.7, 1.15, 0.08]} />
        </Group3D>
      )}
    </Group3D>);

}
