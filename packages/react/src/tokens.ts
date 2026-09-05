/**
 * Axiom Design Tokens — TypeScript exports
 * Mirrors tokens.css. Use these for typed access to design constants
 * (e.g. in tests, programmatic styling, or runtime validation).
 *
 * IMPORTANT: Components should consume CSS variables (var(--paper)) so themes
 * and overrides stay in CSS. Use these constants only for code that needs
 * typed values (test fixtures, config generation, design-system audits).
 */

export const tokens = {
  /** Foundation — warm neutrals, never #000 / #fff */
  paper: '#f6f5f2',
  panel: '#ffffff',
  ink: '#191712',
  ink2: '#6f6c63',
  ink3: '#a9a59a',
  line: '#e7e5dd',
  line2: '#d2cfc5',

  /** Signal — the only two colors allowed bare */
  blue: '#26243F', // THE LAW — identity, structure. Enclosed only.
  red: '#A8322B', // THE MOVE — live, critical, decision. Bare.

  /** Trunk palette (NYCTA) — only for Play mode and 5+ board systems */
  trunk: {
    blue: '#0039A6',
    orange: '#FF6319',
    green: '#00853F',
    red: '#EE352E',
    purple: '#B933AD',
    yellow: '#FCCC0A',
    grey: '#6D6E71',
    brown: '#996633',
  } as const,

  /** Type scale (matches --t-* in CSS) */
  type: {
    hero: 'clamp(30px, 5vw, 38px)',
    big: 'clamp(19px, 3.4vw, 24px)',
    stat: '20px',
    body: '13px',
    label: '11px',
    control: '11px',
    micro: '9px',
  },

  /** Spacing — base unit 11px and multiples */
  gap: {
    2: '2px',
    6: '6px',
    11: '11px',
    13: '13px',
    16: '16px',
    22: '22px',
    44: '44px',
    88: '88px',
  },

  /** Containers */
  maxWidth: {
    tool: '1360px',
    app: '960px',
    doc: '720px',
  },

  /** Motion (see AXIOM-DNA.md §13) */
  motion: {
    easeOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
    easeInOut: 'cubic-bezier(0.77, 0, 0.175, 1)',
    easeHover: 'ease',
    press: '100ms',
    state: '150ms',
    layout: '250ms',
  },
} as const;

export type TrunkColor = keyof typeof tokens.trunk;

/**
 * Hard bans — patterns that must NEVER appear in an Axiom surface.
 * The audit CLI in packages/audit/ greps for these in source files.
 */
export const HARD_BANS = {
  /** Visual chrome */
  visual: [
    'gradient',
    'linear-gradient',
    'radial-gradient',
    'conic-gradient',
    'drop-shadow',
    'filter:.*blur',
    'backdrop-filter',
    'backdrop-blur',
    'box-shadow:.*[1-9]px', // any non-zero shadow (0 0 0 OK)
  ],
  /** Tailwind utility classes that smuggle in template chrome */
  tailwind: [
    'rounded-md',
    'rounded-lg',
    'rounded-xl',
    'rounded-2xl',
    'rounded-3xl',
    'rounded-full',
    'shadow-sm',
    'shadow',
    'shadow-md',
    'shadow-lg',
    'shadow-xl',
    'shadow-2xl',
    'shadow-inner',
    'bg-gradient-to-',
    'blur-',
    'backdrop-blur-',
  ],
  /** Colors — only tokens.* and tokens.trunk.* are allowed */
  colors: [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-emerald-',
    'bg-sky-',
    'bg-indigo-',
    'bg-purple-',
    'bg-pink-',
    'bg-yellow-',
    'bg-orange-',
    'text-red-',
    'text-blue-',
    'text-green-',
    'text-emerald-',
    'text-sky-',
    'text-indigo-',
    'text-purple-',
    'text-pink-',
    'text-yellow-',
    'text-orange-',
  ],
  /** Type system */
  type: ['font-bold', 'font-extrabold', 'font-black', 'font-weight: 700', 'font-weight: 800', 'font-weight: 900'],
  /** Motion */
  motion: ['animate-bounce', 'animate-pulse', 'transition-all duration-700', 'transition-all duration-1000'],
} as const;

/** Maximum font weight on data. Restraint reads as confidence. */
export const MAX_DATA_WEIGHT = 600;
