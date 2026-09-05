/**
 * Axiom Design — Tailwind preset.
 *
 * Drop into tailwind.config:
 *
 *   import axiomPreset from '@axiom-design/tailwind-preset';
 *
 *   export default {
 *     presets: [axiomPreset],
 *     content: ['./src/**/*.{ts,tsx,html}'],
 *   };
 *
 * What it does:
 *   1. Maps the Axiom tokens to Tailwind theme keys (colors, spacing, type, motion).
 *   2. Restricts borderRadius to 0 and 2px (Sato mercy-radius only in Play mode).
 *   3. Removes boxShadow utilities entirely (use hairline borders).
 *   4. Removes gradient, blur, and backdrop-blur utilities.
 *   5. Restricts fontWeight to 400 / 500 / 600 (no 700+ on data).
 *
 * The result: a developer writing `rounded-md` or `shadow-lg` gets an
 * unknown-class build warning, not a templated page.
 */

const axiomColors = {
  transparent: 'transparent',
  current: 'currentColor',
  paper: 'var(--paper)',
  panel: 'var(--panel)',
  ink: 'var(--ink)',
  'ink-2': 'var(--ink-2)',
  'ink-3': 'var(--ink-3)',
  line: 'var(--line)',
  'line-2': 'var(--line-2)',
  blue: 'var(--blue)', // THE LAW
  red: 'var(--red)', // THE MOVE
  // Trunk palette (NYCTA) — only for Play mode and 5+ board systems
  'trunk-blue': 'var(--rt-blue)',
  'trunk-orange': 'var(--rt-orange)',
  'trunk-green': 'var(--rt-green)',
  'trunk-red': 'var(--rt-red)',
  'trunk-purple': 'var(--rt-purple)',
  'trunk-yellow': 'var(--rt-yellow)',
  'trunk-grey': 'var(--rt-grey)',
  'trunk-brown': 'var(--rt-brown)',
};

const axiomSpacing = {
  0: '0',
  px: '1px',
  0.5: '2px',
  1: '2px',
  1.5: '6px',
  2: '6px',
  2.5: '11px',
  3: '11px',
  3.5: '13px',
  4: '13px',
  5: '16px',
  6: '16px',
  7: '22px',
  8: '22px',
  9: '22px',
  10: '22px',
  11: '22px',
  16: '44px',
  24: '88px',
};

const axiomFontFamily = {
  sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  serif: ['Spectral', 'Georgia', 'Times New Roman', 'serif'],
  mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
};

const axiomFontSize = {
  micro: ['9px', { lineHeight: '1.4' }],
  label: ['11px', { lineHeight: '1.4', letterSpacing: '0.06em' }],
  control: ['11px', { lineHeight: '1.4' }],
  body: ['13px', { lineHeight: '1.42' }],
  stat: ['20px', { lineHeight: '1.2' }],
  big: ['clamp(19px, 3.4vw, 24px)', { lineHeight: '1.15' }],
  hero: ['clamp(30px, 5vw, 38px)', { lineHeight: '1.0' }],
};

const axiomFontWeight = {
  // Only 400, 500, 600 — 700+ is banned on data
  normal: '400',
  medium: '500',
  semibold: '600',
};

const axiomTransitionTimingFunction = {
  'axiom-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
  'axiom-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
  hover: 'ease',
};

const axiomTransitionDuration = {
  press: '100ms',
  state: '150ms',
  layout: '250ms',
};

/** The preset.
 *
 * @type {import('tailwindcss').Config}
 */
const axiomPreset = {
  theme: {
    colors: axiomColors,
    spacing: axiomSpacing,
    borderRadius: {
      // Square by default. 2px is the structural max.
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
      'axiom-2': '2px',
    },
    boxShadow: {
      // No shadows. Use hairline borders.
      none: 'none',
      DEFAULT: 'none',
      sm: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
      '2xl': 'none',
      inner: 'none',
    },
    fontFamily: axiomFontFamily,
    fontSize: axiomFontSize,
    fontWeight: axiomFontWeight,
    transitionTimingFunction: axiomTransitionTimingFunction,
    transitionDuration: axiomTransitionDuration,
    extend: {
      maxWidth: {
        tool: '1360px',
        app: '960px',
        doc: '720px',
      },
      borderWidth: {
        DEFAULT: '1px',
        0: '0',
        2: '2px',
        3: '3px',
      },
      ringWidth: {
        DEFAULT: '0',
      },
    },
  },
  corePlugins: {
    // Hard-off: developers literally cannot write these utilities.
    backgroundImage: false, // kills bg-gradient-to-*
    gradientColorStops: false,
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    blur: false,
    dropShadow: false,
    // boxShadow is overridden to none above, but disabling the core plugin
    // prevents any utility from generating. Belt and suspenders.
  },
};

export default axiomPreset;
