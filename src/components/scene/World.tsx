import React, { memo } from 'react';
import { ThreeCanvas } from './engine/ThreeCanvas';
import { ScrollDriver } from './core/ScrollDriver';
import { Atmosphere } from './core/Atmosphere';
import { CameraRig } from './core/CameraRig';
import { ReadySignal } from './core/ReadySignal';
import { HeroRig } from './hero/HeroRig';
import { KollamScene } from './kollam/KollamScene';
import { TownScene } from './town/TownScene';
import { RideScene } from './ride/RideScene';
import { SkyScene } from './sky/SkyScene';
import { SkydiveScene } from './skydive/SkydiveScene';
import { ChennaiScene } from './chennai/ChennaiScene';
import { device } from '../../utils/device';
import type { ScrollRef } from '../../types/scroll';

type WorldProps = {scroll: ScrollRef;onReady: () => void;};

/** The single continuous low-poly world, fixed behind the page. */
export const World = memo(function World({ scroll, onReady }: WorldProps) {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <ThreeCanvas dpr={device.isMobile ? 1 : [1, 1.5]} fov={device.isMobile ? 62 : 50} position={[3, 3, 17]} clearColor="#F0A894">
        <ScrollDriver scroll={scroll} />
        <Atmosphere scroll={scroll} />
        <CameraRig scroll={scroll} />
        <HeroRig scroll={scroll} />
        <KollamScene scroll={scroll} />
        <TownScene scroll={scroll} />
        <RideScene scroll={scroll} />
        <SkyScene scroll={scroll} />
        <SkydiveScene scroll={scroll} />
        <ChennaiScene scroll={scroll} />
        <ReadySignal onReady={onReady} />
      </ThreeCanvas>
    </div>);

});