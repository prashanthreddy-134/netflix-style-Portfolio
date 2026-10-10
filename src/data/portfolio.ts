import repoOverrides from './overrides.json';
import { getRemoteContent } from './content-store';

/**
 * Central portfolio data — generated from Prashanth's resume (Prashanth_Resume_.pdf).
 * Every fact on the site comes from this file. Update it here and the whole site follows.
 * Nothing here should be added unless it appears on the resume.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Prashanth Reddy S',
  displayName: 'Prashanth Reddy S',
  firstName: 'PRASHANTH',
  seriesTag: 'THE SERIES',
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: 'A PRASHANTH ORIGINAL',
  role: 'Frontend Developer',
  tagline: ['Frontend Developer', 'React · JavaScript', 'Tailwind CSS'],
  intro:
    'A BE Information Science & Engineering student (2023–2027) building responsive, production-grade web applications with React, JavaScript and Tailwind CSS, and seeking a Frontend Developer internship.',
  location: 'Bengaluru, Karnataka',
  email: 'prashanthreddy9878@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/prashanth-reddy-s134',
    github: 'https://github.com/prashanthreddy-134',
  },
  resumePdf: '/assets/Prashanth_Reddy_Resume.pdf',
  portrait: {
    src: '/assets/portrait-720.webp',
    srcSet: '/assets/portrait-420.webp 420w, /assets/portrait-720.webp 720w, /assets/portrait-1100.webp 1100w',
    alt: 'Portrait of Prashanth Reddy S',
  },
  interests: ['Responsive Web Design', 'User Experience', 'Performance Optimization'],
};

export const education = [
  {
    school: 'Brindavan College of Engineering',
    place: 'Bengaluru',
    degree: 'Bachelor of Engineering — Information Science and Engineering',
    period: '2023 – 2027',
    score: '2027',
  },
];

export const experience = [
  {
    company: 'YuvaIntern (NSDC Certified Program)',
    role: 'Virtual SAP PP Process Intern',
    place: 'Virtual',
    period: 'August 2026',
    points: [
      'Completed an NSDC certified internship demonstrating dedication, professionalism, and commitment to learning enterprise systems.',
    ],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  year: string;
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  /** Omit when no public repository is linked on the resume — the GitHub button is hidden. */
  github?: string;
  /** Live site or demo link. Omit to hide the button. */
  website?: string;
  palette: Palette;
  motif: 'shield' | 'flow' | 'tenants';
};

export const projects: Project[] = [
  {
    id: 'sheegra',
    title: 'Sheegra',
    year: 'Recent',
    genre: 'Full-Stack • E-Commerce',
    logline: 'A grocery delivery application with authentication, a product catalog, cart and order tracking.',
    stack: ['JavaScript', 'React', 'Node.js', 'Express.js', 'HTML5', 'CSS3'],
    build: [
      'Built a full-stack grocery delivery platform with authentication, product catalog, cart, and order tracking.',
      'Designed a responsive interface optimized for desktop and mobile with a seamless user experience.',
    ],
    features: ['Authentication', 'Product catalog', 'Cart', 'Order tracking', 'Responsive desktop & mobile UI'],
    metrics: [
      { value: '4', label: 'core flows: auth, catalog, cart, orders' },
      { value: '2', label: 'layouts: desktop & mobile' },
    ],
    palette: { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' },
    motif: 'flow',
  },
  {
    id: 'house-price-prediction',
    title: 'House Price Prediction',
    year: 'Recent',
    genre: 'Machine Learning • Regression',
    logline: 'A regression model that predicts house prices from preprocessed, feature-engineered data.',
    stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy'],
    build: [
      'Developed an ML regression model for predicting house prices using data preprocessing and feature engineering.',
      'Achieved high prediction accuracy through iterative model optimization.',
    ],
    features: ['Data preprocessing', 'Feature engineering', 'Regression modeling', 'Iterative model optimization'],
    metrics: [
      { value: '4', label: 'pipeline stages' },
      { value: '3', label: 'core libraries' },
    ],
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'shield',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
  /** Certificate image (data URL or /assets path). Shown in a viewer instead of opening the link. */
  image?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'yuvaintern',
    title: 'Virtual SAP PP Process Intern',
    org: 'YuvaIntern • NSDC Certified',
    detail: 'Completed an NSDC certified internship focused on enterprise systems, with professionalism and a commitment to learning.',
    laurel: 'NSDC Certified',
  },
  {
    id: 'meta-frontend',
    title: 'Front-End Developer Certificate',
    org: 'Coursera',
    detail: 'Meta Front-End Developer Professional Certificate — 9 courses, completed September 2026.',
    laurel: '9 Courses',
  },
  {
    id: 'cisco-python',
    title: 'Python Essentials 1 & 2',
    org: 'Cisco Networking Academy',
    detail: 'Two-part Python programming track, completed September 2026.',
    laurel: 'Python',
  },
];

export type Certification = { issuer: string; name: string; link: string; image?: string };

/** Resume lists these without public links, so the link is empty and the item is not clickable. */
export const certifications: Certification[] = [
  { issuer: 'Coursera', name: 'Meta Front-End Developer Professional Certificate', link: '' },
  { issuer: 'Cisco Networking Academy', name: 'Python Essentials 1', link: '' },
  { issuer: 'Cisco Networking Academy', name: 'Python Essentials 2', link: '' },
  { issuer: 'ITKraftz', name: 'Certified Dark Web Analyst (CDWA)', link: '' },
  { issuer: 'TATA / Forge', name: 'GenAI Powered Data Analytics Job Simulation', link: '' },
  { issuer: 'IBM SkillsBuild', name: 'Introduction to IoT', link: '' },
];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'JavaScript leads the frontend',
    skills: [
      { name: 'JavaScript', mono: 'Js', note: 'ES6+' },
      { name: 'HTML5', mono: 'Ht' },
      { name: 'CSS3', mono: 'Cs' },
      { name: 'Python', mono: 'Py' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'Interfaces & responsive design',
    skills: [
      { name: 'React.js', mono: 'Re', note: 'Primary' },
      { name: 'Tailwind CSS', mono: 'Tw' },
      { name: 'Flexbox', mono: 'Fx' },
      { name: 'CSS Grid', mono: 'Gd' },
      { name: 'Responsive Web Design', mono: 'Rw' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    subtitle: 'Server-side foundations',
    skills: [
      { name: 'Node.js', mono: 'No' },
      { name: 'Express.js', mono: 'Ex' },
      { name: 'REST APIs', mono: 'Ap' },
    ],
  },
  {
    id: 'data',
    title: 'Data & ML',
    subtitle: 'Modeling & analysis',
    skills: [
      { name: 'Scikit-Learn', mono: 'Sk' },
      { name: 'Pandas', mono: 'Pd' },
      { name: 'NumPy', mono: 'Np' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    subtitle: 'Workflow & debugging',
    skills: [
      { name: 'Git', mono: 'Gt' },
      { name: 'GitHub', mono: 'Gh' },
      { name: 'VS Code', mono: 'Vs' },
      { name: 'NPM', mono: 'Nm' },
      { name: 'Browser DevTools', mono: 'Dt' },
    ],
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill appears in the projects, certifications or achievements on the resume.
 */
export const skillEvidence: Record<string, string[]> = {
  JavaScript: ['Sheegra', 'Meta Front-End Developer Certificate'],
  HTML5: ['Sheegra', 'Meta Front-End Developer Certificate'],
  CSS3: ['Sheegra', 'Meta Front-End Developer Certificate'],
  Python: ['House Price Prediction', 'Python Essentials 1 & 2'],
  'React.js': ['Sheegra'],
  'Tailwind CSS': ['Listed under Frontend skills'],
  Flexbox: ['Responsive interface design'],
  'CSS Grid': ['Responsive interface design'],
  'Responsive Web Design': ['Sheegra — desktop & mobile'],
  'Node.js': ['Sheegra'],
  'Express.js': ['Sheegra'],
  'REST APIs': ['Sheegra'],
  'Scikit-Learn': ['House Price Prediction'],
  Pandas: ['House Price Prediction'],
  NumPy: ['House Price Prediction'],
  Git: ['Listed under Tools'],
  GitHub: ['Listed under Tools'],
  'VS Code': ['Listed under Tools'],
  NPM: ['Listed under Tools'],
  'Browser DevTools': ['Listed under Tools'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'The Engineer',
    period: '2023 – 2027',
    synopsis: 'Bachelor of Engineering in Information Science and Engineering at Brindavan College of Engineering, Bengaluru.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'The Student',
        description: 'BE in Information Science and Engineering at Brindavan College of Engineering, Bengaluru.',
        tags: ['B.E.', 'ISE'],
        runtime: '2023 – 2027',
        palette: violet,
      },
    ],
  },
  {
    number: 2,
    title: 'Learning the Frontend',
    period: '2026',
    synopsis: 'Front-end and Python certifications, plus a virtual internship.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'The Front-End Developer',
        description: 'Meta Front-End Developer Professional Certificate on Coursera — nine courses, completed September 2026.',
        tags: ['Front-End', 'Coursera'],
        runtime: 'Sep 2026',
        palette: crimson,
      },
      {
        code: 'S02 E02',
        title: 'The Python Learner',
        description: 'Cisco Networking Academy: Python Essentials 1 & 2.',
        tags: ['Python', 'Cisco'],
        runtime: 'Sep 2026',
        palette: amber,
      },
      {
        code: 'S02 E03',
        title: 'The Intern',
        description: 'Virtual SAP PP Process Intern with YuvaIntern, an NSDC Certified Program.',
        tags: ['YuvaIntern', 'NSDC'],
        runtime: 'Aug 2026',
        palette: ocean,
      },
    ],
  },
  {
    number: 3,
    title: 'Building Products',
    period: '2026',
    synopsis: 'A full-stack grocery app and a machine learning regression model.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'The Grocer',
        description: 'Sheegra — a full-stack grocery delivery app with authentication, cart and order tracking.',
        tags: ['React', 'Node.js', 'Express.js'],
        runtime: 'Recent',
        palette: jade,
      },
      {
        code: 'S03 E02',
        title: 'The Predictor',
        description: 'House Price Prediction — an ML regression model built with preprocessing and feature engineering.',
        tags: ['Python', 'Scikit-Learn'],
        runtime: 'Recent',
        palette: violet,
      },
    ],
  },
  {
    number: 4,
    title: "What's Next",
    period: 'Now streaming',
    synopsis: 'Looking to contribute as a Frontend Developer intern.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'The Next Chapter',
        description: 'Seeking a Frontend Developer internship to contribute technical expertise.',
        tags: ['Frontend', 'Internship'],
        runtime: 'In production',
        palette: crimson,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Primary framework', title: 'React.js', detail: 'Used to build Sheegra • Frontend focus', palette: amber },
  { label: 'Flagship project', title: 'Sheegra', detail: 'Full-stack grocery delivery platform', palette: crimson },
  { label: 'The ML project', title: 'House Prices', detail: 'Regression model • Scikit-Learn', palette: violet },
  { label: 'The internship', title: 'YuvaIntern', detail: 'Virtual SAP PP Process Intern • NSDC', palette: ocean },
  { label: 'Front-end credential', title: 'Meta', detail: 'Front-End Developer Professional Certificate', palette: jade },
  { label: 'Styling', title: 'Tailwind CSS', detail: 'Flexbox • CSS Grid • Responsive design', palette: amber },
  { label: 'Python track', title: 'Cisco', detail: 'Python Essentials 1 & 2', palette: crimson },
  { label: 'The degree', title: 'B.E. ISE', detail: 'Brindavan College of Engineering', palette: violet },
  { label: 'Languages', title: 'Four', detail: 'English • Kannada • Telugu • Hindi (beginner)', palette: ocean },
  { label: 'Current goal', title: 'Frontend', detail: 'Seeking a Frontend Developer internship', palette: jade },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Education',
    title: 'B.E. · ISE',
    lines: ['Brindavan College of Engineering, Bengaluru', '2023 – 2027'],
  },
  {
    kicker: 'Skills',
    title: 'Frontend first.',
    lines: ['JavaScript (ES6+), HTML5, CSS3, React.js', 'Tailwind CSS, Flexbox, CSS Grid, Responsive Design'],
    chips: ['React', 'JavaScript', 'Tailwind', 'Node.js', 'Git', 'Python'],
  },
  {
    kicker: 'Internship',
    title: 'The Intern',
    lines: ['Virtual SAP PP Process Intern', 'YuvaIntern (NSDC Certified Program) · August 2026'],
  },
  {
    kicker: 'Projects',
    title: 'Two Originals',
    lines: ['Sheegra — grocery delivery, full-stack', 'House Price Prediction — ML regression'],
  },
  {
    kicker: 'Certified',
    title: '6 Certifications',
    lines: ['Coursera · Cisco · IBM SkillsBuild · TATA / Forge', 'ITKraftz · Meta Front-End Developer'],
  },
  {
    kicker: 'Languages',
    title: 'Four Languages',
    lines: ['English · Kannada · Telugu · Hindi (beginner)'],
  },
  {
    kicker: 'Current mission',
    title: 'Now exploring',
    lines: ['Seeking a Frontend Developer internship'],
  },
];

export type ProfileId = 'prashanth' | 'recruiter' | 'developer' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
  {
    id: 'prashanth',
    name: 'Prashanth',
    blurb: 'The full series, in order',
    color: '#e5132b',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Resume, achievements & skills first',
    color: '#4cc9ff',
    order: ['story', 'moments', 'skills', 'originals', 'about', 'journey', 'picks'],
  },
  {
    id: 'developer',
    name: 'Developer',
    blurb: 'Projects, stack & GitHub first',
    color: '#46e3a8',
    order: ['originals', 'skills', 'journey', 'moments', 'about', 'picks', 'story'],
  },
  {
    id: 'creative',
    name: 'Creative',
    blurb: 'The story arc & highlights first',
    color: '#ffb547',
    order: ['journey', 'picks', 'originals', 'moments', 'about', 'skills', 'story'],
  },
];

// ---------- Editable data layer ----------
// Load order: built-in data above → committed src/data/overrides.json → shared content from the server (latest wins).
const DATA = { profile, education, experience, projects, achievements, certifications, skillCategories, skillEvidence, seasons, topPicks, introSlides, viewerProfiles };
export type DataKey = keyof typeof DATA;
export const DATA_KEYS = Object.keys(DATA) as DataKey[];

/** A deep copy of every editable section, reflecting all overrides applied so far. */
export function getAllData(): typeof DATA {
  return structuredClone(DATA);
}

function applyData(src: unknown) {
  if (!src || typeof src !== 'object') return;
  for (const key of DATA_KEYS) {
    const value = (src as Record<string, unknown>)[key];
    if (value === undefined) continue;
    const target = DATA[key] as unknown;
    if (Array.isArray(target)) {
      if (Array.isArray(value)) target.splice(0, target.length, ...value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      const t = target as Record<string, unknown>;
      for (const k of Object.keys(t)) delete t[k];
      Object.assign(t, value);
    }
  }
}

applyData(repoOverrides);
applyData(getRemoteContent());

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Education & internship', palette: violet },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${seasons.reduce((n, s) => n + s.episodes.length, 0)} Episodes`, palette: amber },
  originals: { nav: 'Originals', card: 'My Projects', meta: `${projects.length} Originals`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top Picks', meta: 'Top 10 from the resume', palette: jade },
  skills: { nav: 'Skills', card: 'My Skills', meta: `${skillCategories.length} Categories`, palette: ocean },
  moments: { nav: 'Moments', card: 'My Achievements', meta: `${achievements.length} Moments • ${certifications.length} Certifications`, palette: crimson },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download', palette: violet },
};
