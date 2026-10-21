import React, { useRef } from 'react';
import { useProgressFrame } from '../../hooks/useProgressFrame';
import { smoothRemap } from '../../utils/progress';
import { reveal } from '../../utils/dom';
import { CONTENT } from '../../data/content';
import type { ScrollRef } from '../../types/scroll';

/** Finale contact card. Frosted glass, kept above the landed character. */
export function ContactPanel({ scroll }: {scroll: ScrollRef;}) {
  const card = useRef<HTMLDivElement>(null);
  const { email, phone, phoneHref, linkedin } = CONTENT.contact;
  const links = [
  { label: 'Email', value: email, href: `mailto:${email}`, external: false },
  { label: 'Phone', value: phone, href: phoneHref, external: false },
  { label: 'LinkedIn', value: 'vishnu-k2730', href: linkedin, external: true }];


  useProgressFrame(scroll, (p) => {
    const o = smoothRemap(p, 0.872, 0.9);
    reveal(card.current, o, 0, 18 * (1 - o), true);
  });

  return (
    <section aria-labelledby="contact-heading" className="pointer-events-none fixed left-4 right-4 top-16 z-10 md:left-[4vw] md:right-auto md:top-[12vh] md:w-[min(420px,36vw)]">
      <div
        ref={card}
        style={{ opacity: 0, visibility: 'hidden' }}
        className="glass-light w-full rounded-[28px] px-5 py-5 text-[#102033] md:px-6 md:py-5">
        
        <h2 id="contact-heading" className="text-[15px] font-semibold tracking-[-0.01em] text-[#243044]">
          Contact
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {links.map((l) =>
          <li key={l.label}>
              <a
              href={l.href}
              aria-label={l.external ? `${l.label}, ${l.value}, opens in a new tab` : `${l.label}, ${l.value}`}
              {...l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
              className="flex min-h-12 items-center justify-between gap-4 rounded-2xl bg-white/70 px-4 py-3 text-left ring-1 ring-white/80 transition-colors duration-150 hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102033]">
              
                <span className="shrink-0 text-[15px] font-semibold text-[#243044]">{l.label}</span>
                <span className="min-w-0 break-all text-right text-[15px] font-medium leading-snug text-[#102033]">{l.value}</span>
              </a>
            </li>
          )}
        </ul>
        <p className="mt-4 text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-[#102033] md:text-[26px]">
          {CONTENT.closing}
        </p>
      </div>
    </section>);

}
