import React from 'react';

const box = 'h-4 w-4 shrink-0 md:h-[18px] md:w-[18px]';

function Adobe({ color, mark }: {color: string;mark: string;}) {
  return (
    <svg viewBox="0 0 24 24" className={box} aria-hidden="true">
      <rect width="24" height="24" rx="5.5" fill={color} />
      <text
        x="12"
        y="16.4"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#fff"
        fontFamily="Inter, ui-sans-serif, system-ui">
        {mark}
      </text>
    </svg>);

}

function Line({ children }: {children: React.ReactNode;}) {
  return (
    <svg viewBox="0 0 24 24" className={box} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>);

}

const ICONS: Record<string, () => React.ReactElement> = {
  'Adobe Photoshop': () => <Adobe color="#31A8FF" mark="Ps" />,
  'Adobe Illustrator': () => <Adobe color="#FF9A00" mark="Ai" />,
  'Adobe After Effects': () => <Adobe color="#9999FF" mark="Ae" />,
  'Adobe Audition': () => <Adobe color="#00C4B3" mark="Au" />,
  Figma: () =>
  <svg viewBox="0 0 200 300" className="h-4 w-[11px] shrink-0 md:h-[18px] md:w-[12px]" aria-hidden="true">
      <path fill="#F24E1E" d="M0 50C0 22.4 22.4 0 50 0h50v100H50C22.4 100 0 77.6 0 50z" />
      <path fill="#FF7262" d="M100 0h50c27.6 0 50 22.4 50 50s-22.4 50-50 50h-50V0z" />
      <path fill="#A259FF" d="M0 150c0-27.6 22.4-50 50-50h50v100H50c-27.6 0-50-22.4-50-50z" />
      <path fill="#1ABCFE" d="M200 150c0 27.6-22.4 50-50 50s-50-22.4-50-50 22.4-50 50-50 50 22.4 50 50z" />
      <path fill="#0ACF83" d="M50 300c27.6 0 50-22.4 50-50v-50H50c-27.6 0-50 22.4-50 50s22.4 50 50 50z" />
    </svg>,

  Sketch: () =>
  <svg viewBox="0 0 24 24" className={box} aria-hidden="true">
      <path fill="#F7B500" d="M12 1.8 21.2 8.2 12 22.2 2.8 8.2 12 1.8z" />
      <path fill="#EA6C00" d="M12 1.8 21.2 8.2 12 10.2 2.8 8.2 12 1.8z" />
    </svg>,

  ChatGPT: () =>
  <svg viewBox="0 0 24 24" className={box} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#10A37F" />
      <g fill="#fff">
        {[0, 60, 120, 180, 240, 300].map((deg) =>
        <ellipse key={deg} cx="12" cy="7.6" rx="1.55" ry="3.15" transform={`rotate(${deg} 12 12)`} />
        )}
      </g>
    </svg>,

  Claude: () =>
  <svg viewBox="0 0 24 24" className={box} aria-hidden="true">
      <g stroke="#D97757" strokeWidth="2.15" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => {
          const a = i / 12 * Math.PI * 2;
          return (
            <line
              key={i}
              x1={12 + Math.cos(a) * 3.1}
              y1={12 + Math.sin(a) * 3.1}
              x2={12 + Math.cos(a) * 10.4}
              y2={12 + Math.sin(a) * 10.4} />);


        })}
      </g>
    </svg>,

  Cursor: () =>
  <svg viewBox="0 0 24 24" className={box} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#141414" />
      <path fill="#fff" d="M7.2 5.4 18.2 11.2 12.4 12.6 10.6 18.6 7.2 5.4z" />
    </svg>,

  'Google Antigravity': () =>
  <svg viewBox="0 0 24 24" className={box} aria-hidden="true">
      <defs>
        <linearGradient id="antigravity-mark" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3186FF" />
          <stop offset="36%" stopColor="#00B95C" />
          <stop offset="68%" stopColor="#FFE432" />
          <stop offset="100%" stopColor="#FC413D" />
        </linearGradient>
      </defs>
      <path
        fill="none"
        stroke="url(#antigravity-mark)"
        strokeWidth="3.3"
        strokeLinecap="round"
        d="M5.2 18.8C5.6 11.2 8.2 5.4 12 5.4s6.4 5.8 6.8 13.4" />
      
    </svg>,

  'Claude Code': () =>
  <svg viewBox="0 0 24 24" className={box} aria-hidden="true">
      <rect width="24" height="24" rx="6" fill="#D97757" />
      <path d="M6.4 8.8 3.8 12l2.6 3.2M10 15.2h7.4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,

  'UX Research': () =>
  <Line>
      <circle cx="10.2" cy="10.2" r="5.2" />
      <path d="m14.2 14.2 5 5" />
    </Line>,

  'UI Design': () =>
  <Line>
      <rect x="3.5" y="4" width="17" height="16" rx="2.2" />
      <path d="M3.5 8.5h17M8.5 8.5V20" />
    </Line>,

  Prototyping: () =>
  <Line>
      <rect x="7" y="3.5" width="12" height="14" rx="2" />
      <path d="M5 7.5H4.2A1.7 1.7 0 0 0 2.5 9.2v9.1A1.7 1.7 0 0 0 4.2 20H14" />
    </Line>,

  'Design Systems': () =>
  <Line>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" fill="currentColor" />
    </Line>,

  'Interaction Design': () =>
  <Line>
      <path d="M5 4.5 5 14.2 8.4 11.4 11.2 17.2 13.4 16.2 10.6 10.6 14.6 10.4 5 4.5z" />
    </Line>,

  'UX Writing': () =>
  <Line>
      <path d="M4 7h16M4 12h12M4 17h8" />
      <path d="m16.2 14.2 3.2-3.2-1.6-1.6-3.2 3.2V15h1.6z" />
    </Line>,

  'Developer Collaboration': () =>
  <Line>
      <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
    </Line>,

  'Product Thinking': () =>
  <Line>
      <circle cx="12" cy="12" r="8" />
      <path d="m12 8 1.4 4.2L12 16l-1.4-3.8L12 8z" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </Line>,

  Ideation: () =>
  <Line>
      <path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </Line>,

  'Design Critique': () =>
  <Line>
      <path d="M5 6.5h14v9H9.5L5 19v-3.2" />
      <path d="M8.5 11h7" />
    </Line>
};

export function ToolkitIcon({ name }: {name: string;}) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon />;
}
