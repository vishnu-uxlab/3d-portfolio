import React, { useRef } from 'react';
import { useProgressFrame } from '../../hooks/useProgressFrame';
import { smoothRemap } from '../../utils/progress';
import { reveal } from '../../utils/dom';
import { CONTENT } from '../../data/content';
import type { ScrollRef } from '../../types/scroll';

const STATS = [
  { value: '35+', label: 'Projects' },
  { value: '11', label: 'Tools' },
  { value: '20+', label: 'Skills' }
];

function Mark({ children, color }: {children: React.ReactNode;color: string;}) {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>);
}

/** Finale contact card. A frosted profile kept above the landed character. */
export function ContactPanel({ scroll }: {scroll: ScrollRef;}) {
  const card = useRef<HTMLDivElement>(null);
  const { email, phone, phoneHref, linkedin } = CONTENT.contact;

  useProgressFrame(scroll, (p) => {
    const o = smoothRemap(p, 0.872, 0.9);
    reveal(card.current, o, 0, 18 * (1 - o), true);
  });

  return (
    <section aria-labelledby="contact-heading" className="pointer-events-none fixed left-4 right-4 top-16 z-10 md:left-[4vw] md:right-auto md:top-[12vh] md:w-[min(560px,48vw)]">
      <div
        ref={card}
        style={{ opacity: 0, visibility: 'hidden' }}
        className="glass-profile w-full rounded-[28px] px-4 py-4 text-white md:px-5 md:py-5">

        <div className="flex items-center gap-3.5 md:gap-4">
          <div className="portrait-ring h-[72px] w-[72px] shrink-0 rounded-full p-[3px] md:h-[84px] md:w-[84px]">
            <img
              src="/portrait.jpg"
              alt="Portrait of Vishnu K"
              className="h-full w-full rounded-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="contact-heading" className="flex items-center gap-2.5">
              <span className="text-[22px] font-bold leading-none tracking-[-0.03em] md:text-[26px]">{CONTENT.name}</span>
              <span className="h-4 w-px shrink-0 bg-white/40" aria-hidden="true" />
              <span className="text-[13px] font-medium leading-none text-white/90 md:text-[15px]">{CONTENT.role}</span>
            </h2>
            <dl className="mt-3 flex items-start justify-between">
              {STATS.map((stat) =>
              <div key={stat.label} className="text-center">
                <dt className="text-[18px] font-bold leading-none tracking-[-0.03em] md:text-[22px]">{stat.value}</dt>
                <dd className="mt-1 text-[11px] text-white/90 md:text-[12px]">{stat.label}</dd>
              </div>
              )}
            </dl>
          </div>
        </div>

        <div className="mt-4 space-y-1.5 text-[13px] leading-snug md:text-[14px]">
          <p className="flex items-start gap-1.5">
            <Mark color="#7EB6FF">
              <circle cx="12" cy="12" r="8" />
              <path d="M4 12h16M12 4c2.4 2.6 2.4 13.4 0 16M12 4c-2.4 2.6-2.4 13.4 0 16" />
            </Mark>
            <span>Chennai, Tamil Nadu</span>
          </p>
          <p className="flex items-start gap-1.5">
            <Mark color="#F6D56A">
              <path d="M9 18h6M10 21h4" />
              <path d="M12 3a5.5 5.5 0 0 0-3 10c.4.5.8 1.2.8 2h4.4c0-.8.4-1.5.8-2A5.5 5.5 0 0 0 12 3z" />
            </Mark>
            <span>{CONTENT.closing}</span>
          </p>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/90 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <Mark color="#FFFFFF">
              <path d="M10 13a5 5 0 0 0 7.1.4l2.2-2.2a5 5 0 0 0-7.1-7.1L11 5.3" />
              <path d="M14 11a5 5 0 0 0-7.1-.4L4.7 12.8a5 5 0 0 0 7.1 7.1L13 18.7" />
            </Mark>
            linkedin.com/in/vishnu-k2730
          </a>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/90">
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <Mark color="#7DDE9A">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </Mark>
              {email}
            </a>
            <a href={phoneHref} className="inline-flex items-center gap-1.5 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <Mark color="#7EB6FF">
                <path d="M8 4h3l1.2 3.2-1.8 1.1a12 12 0 0 0 5.3 5.3l1.1-1.8L20 13v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 6.2 2 2 0 0 1 6 4h2z" />
              </Mark>
              {phone}
            </a>
          </p>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <a
            href={`mailto:${email}`}
            className="rounded-xl bg-gradient-to-b from-[#c4b4ff] to-[#7d6cb8] px-2 py-2.5 text-center text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-transform duration-150 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-[14px]">
            Email
          </a>
          <a
            href={phoneHref}
            className="rounded-xl bg-white/20 px-2 py-2.5 text-center text-[13px] font-semibold ring-1 ring-white/45 transition-colors duration-150 hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-[14px]">
            Call
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-white/20 px-2 py-2.5 text-center text-[13px] font-semibold ring-1 ring-white/45 transition-colors duration-150 hover:bg-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-[14px]">
            LinkedIn
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>);
}
