import React from 'react';
import { HeroTitle } from './HeroTitle';
import { AboutCard } from './AboutCard';
import { SkillsList } from './SkillsList';
import { ProjectCards } from './ProjectCards';
import { ContactPanel } from './ContactPanel';
import { ScrollHint } from './ScrollHint';
import type { ScrollRef } from '../../types/scroll';

/** Fixed DOM layer above the canvas; each part fades and slides by scroll progress. */
export function Overlay({ scroll }: {scroll: ScrollRef;}) {
  return (
    <>
      <HeroTitle scroll={scroll} />
      <AboutCard scroll={scroll} />
      <SkillsList scroll={scroll} />
      <ProjectCards scroll={scroll} />
      <ContactPanel scroll={scroll} />
      <ScrollHint scroll={scroll} />
    </>);

}