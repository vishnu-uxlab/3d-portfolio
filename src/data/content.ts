export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  link: {href: string;label: string;};
  tags: string[];
  accent: string;
  detail: {
    problem: string;
    role: string;
    process: string;
    outcome: string;
  };
};

export const CONTENT = {
  name: 'Vishnu K',
  role: 'Product Design Lead',
  bio: [
    "I'm Vishnu K, a Product Design Lead passionate about turning complex challenges into meaningful digital experiences.",
    'Originally from Kollam, Kerala, and now based in Chennai, Tamil Nadu, I design digital products that solve real-world problems across enterprise healthcare, e-commerce, and visual-driven experiences.',
    'My approach blends user research, strategic thinking, and creative problem-solving to transform complexity into intuitive, purposeful interfaces. I believe great design goes beyond how things look — it makes products easier to use, easier to build, and more impactful in the real world.',
    'Explore further to discover my work, ideas, and approach to design.'
  ],
  skills: ['Creative Thinking', 'Problem-Solving', 'User Research', 'Collaboration', 'Visual Communication'],
  toolkit: [
    {
      label: 'Design',
      count: '06',
      items: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe After Effects', 'Adobe Audition', 'Figma', 'Sketch']
    },
    {
      label: 'AI',
      count: '05',
      items: ['ChatGPT', 'Claude', 'Cursor', 'Google Antigravity', 'Claude Code']
    },
    {
      label: 'Product',
      count: '06',
      items: ['UX Research', 'UI Design', 'Prototyping', 'Design Systems', 'Interaction Design', 'UX Writing']
    },
    {
      label: 'Collaboration',
      count: '04',
      items: ['Developer Collaboration', 'Product Thinking', 'Ideation', 'Design Critique']
    }
  ],
  projects: [
  {
    id: 'hallmark',
    title: 'Hallmark Healthcare',
    description:
    'Enterprise workforce platform for health systems, combining flexible workforce and physician enterprise solutions.',
    image: '/work/hallmark.jpg',
    imageAlt: 'Hallmark real-time command center shown on a desktop display',
    link: {
      href: 'https://www.figma.com/proto/Pkh4Ztj03Jg3Nes8V21YBi/Einstein-II---Part-2?page-id=6264%3A11776&node-id=7676-47337&viewport=15%2C-1409%2C0.12&t=06E0D1t0X1r7bgWH-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=7676%3A47337&hide-ui=1',
      label: 'View Figma prototype'
    },
    tags: ['Enterprise', 'Healthcare', 'Product Design'],
    accent: '#6FA8D6',
    detail: {
      problem:
      'Health systems juggle agencies, float pools and physician contracts across disconnected tools, so coverage gaps surface too late.',
      role: 'Led product design end to end: research, information architecture, interaction design and the component library.',
      process:
      'Shadowed staffing coordinators, mapped the shift-filling journey, prototyped dashboards and iterated weekly with engineering.',
      outcome:
      'One calm workspace that brings flexible staff and physician enterprise solutions together, with gaps visible at a glance.'
    }
  },
  {
    id: 'rb-fashion',
    title: 'R&B Fashion',
    description:
    'An e-commerce website experience covering PLP, PDP, payments, rewards and outlet commerce for a fashion brand.',
    image: '/work/rb.png',
    imageAlt: 'R&B storefront with illuminated signage in a shopping mall',
    link: {
      href: 'https://www.figma.com/proto/urG93ZXzY57J9zQeb89ZsV/R-B-Website?page-id=223%3A1139&node-id=677-10777&viewport=1382%2C-7110%2C0.36&t=kArh6N2HhZsynp8B-8&scaling=scale-down-width&content-scaling=fixed&starting-point-node-id=677%3A10777&hide-ui=1',
      label: 'View Figma prototype'
    },
    tags: ['E-commerce', 'Fashion', 'UX/UI'],
    accent: '#E58FA6',
    detail: {
      problem:
      'Shoppers dropped off between browsing and checkout, and rewards and outlet pricing felt like separate stores.',
      role: 'Owned UX and UI for listing, product, cart, payment and rewards flows, partnering with brand and engineering.',
      process:
      'Audited analytics, ran usability sessions, redesigned filters and product pages, then tested checkout variants.',
      outcome:
      'A single, consistent shopping journey where rewards and outlet deals sit naturally inside the core experience.'
    }
  },
  {
    id: 'nrl-imagery',
    title: 'NRL Imagery',
    description:
    'An image-led web experience for browsing official photography collections from the National Rugby League.',
    image: '/work/nrl.png',
    imageAlt: 'NRL Imagery website open on a laptop over a rugby field',
    link: {
      href: 'https://www.behance.net/gallery/139892747/NRL-Imagery',
      label: 'View on Behance'
    },
    tags: ['Sports', 'Media', 'Web Experience'],
    accent: '#7FC4A4',
    detail: {
      problem: 'Thousands of official match photos were hard to browse, search and license from a dated gallery.',
      role: 'Led the experience design: browsing model, search and filtering, collection pages and the image viewer.',
      process:
      'Interviewed media buyers and fans, defined collection structures, prototyped an image-first grid and refined it with real data.',
      outcome: 'A fast, image-first experience that lets the photography lead and makes every collection easy to explore.'
    }
  }] as
  Project[],
  contact: {
    email: 'mailtovishnu2706@gmail.com',
    phone: '+91 90035 81923',
    phoneHref: 'tel:+919003581923',
    linkedin: 'https://www.linkedin.com/in/vishnu-k2730/'
  },
  closing: "Let's design something meaningful together."
};