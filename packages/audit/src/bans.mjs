/**
 * Hard bans — patterns that violate the Axiom / Rams × NYCTA design system.
 *
 * Each entry is a regex; matches across the file count as one violation
 * unless otherwise noted in `scope` (e.g. "imports", "class", "css-prop").
 *
 * Lines that look like comments or are inside a `// axiom-audit-ignore`
 * directive are skipped.
 */

export const BANS = {
  /** Tailwind utility classes that smuggle in template chrome. */
  tailwind: [
    // Rounded corners
    { re: /\brounded-(sm|md|lg|xl|2xl|3xl|full)\b/g, msg: 'Rounded corners are banned. Use square (0–2px) edges only.' },
    { re: /\brounded-t(?:l|r|tr|tl|br)?-(sm|md|lg|xl|2xl|3xl|full)\b/g, msg: 'Rounded corners are banned.' },
    { re: /\brounded-b(?:l|r|tr|tl|br)?-(sm|md|lg|xl|2xl|3xl|full)\b/g, msg: 'Rounded corners are banned.' },
    // Shadows
    { re: /\bshadow-(sm|md|lg|xl|2xl|inner)\b/g, msg: 'Drop shadows are banned. Use hairline borders instead.' },
    { re: /\bshadow\b(?!\s*:)/g, msg: 'Drop shadows are banned.' },
    // Gradients
    { re: /\bbg-gradient-to-[a-z]+\b/g, msg: 'Gradients are banned. Use solid colors only.' },
    // Blur
    { re: /\bblur(?:-\d+)?\b/g, msg: 'Blur is banned (no glassmorphism).' },
    { re: /\bbackdrop-blur(?:-\w+)?\b/g, msg: 'Backdrop-blur is banned (no glassmorphism).' },
    // Emoji-grade color utilities
    { re: /\b(?:bg|text|border)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g, msg: 'Emoji-grade color utilities are banned. Use --blue, --red, or trunk tokens only.' },
    // Gradient color stops
    { re: /\bfrom-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g, msg: 'Gradient color stops are banned.' },
    { re: /\bvia-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g, msg: 'Gradient color stops are banned.' },
    { re: /\bto-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/g, msg: 'Gradient color stops are banned.' },
    // Heavy font weights
    { re: /\bfont-bold\b/g, msg: 'Font weight 700+ is banned on data. Use 500–600 max.' },
    { re: /\bfont-extrabold\b/g, msg: 'Font weight 700+ is banned.' },
    { re: /\bfont-black\b/g, msg: 'Font weight 700+ is banned.' },
  ],

  /** CSS / inline style violations. Both kebab-case (CSS) and camelCase (React inline styles). */
  css: [
    { re: /linear-gradient\s*\(/g, msg: 'linear-gradient is banned.' },
    { re: /radial-gradient\s*\(/g, msg: 'radial-gradient is banned.' },
    { re: /conic-gradient\s*\(/g, msg: 'conic-gradient is banned.' },
    { re: /\bbackdrop-filter\s*:/g, msg: 'backdrop-filter is banned (no glassmorphism).' },
    { re: /\bbackdropFilter\s*:/g, msg: 'backdrop-filter is banned (no glassmorphism).' },
    { re: /\bfilter\s*:[^;]*\bblur\s*\(/g, msg: 'CSS blur filter is banned.' },
    { re: /\bfilter\s*:[^;]*\bblur\s*\(/g, msg: 'CSS blur filter is banned.' },
    { re: /\bbox-shadow\s*:[^;]*[1-9]px/g, msg: 'Non-zero box-shadow is banned. Use hairline borders instead.' },
    { re: /\bboxShadow\s*:\s*['"][^'"]*[1-9]px/g, msg: 'Non-zero boxShadow is banned. Use hairline borders instead.' },
    { re: /\bfont-weight\s*:\s*(7\d\d|8\d\d|9\d\d)\b/g, msg: 'Font weight 700+ is banned on data.' },
    { re: /\bfontWeight\s*:\s*(7\d\d|8\d\d|9\d\d)\b/g, msg: 'Font weight 700+ is banned on data.' },
    { re: /\bborder-radius\s*:[^;]*[3-9]px/g, msg: 'border-radius ≥ 3px is banned. Use 0 or 2px.' },
    { re: /\bborderRadius\s*:\s*['"][^'"]*[3-9]px/g, msg: 'borderRadius ≥ 3px is banned. Use 0 or 2px.' },
    { re: /\bborder-radius\s*:[^;]*\d+rem\b/g, msg: 'rem-based border-radius is banned.' },
    { re: /\bborderRadius\s*:\s*['"][^'"]*\d+rem/g, msg: 'rem-based borderRadius is banned.' },
  ],

  /** Color literals in code — pure #000 and #fff are banned. */
  colors: [
    { re: /['"`]#[0-9a-fA-F]{6}['"`]/g, msg: 'Hardcoded hex color. Use --paper / --ink / --blue / --red / trunk tokens.', severity: 'warn' },
    { re: /['"`]#000(?:000)?['"`]/g, msg: 'Pure #000 is banned. Use --ink (#191712).' },
    { re: /['"`]#fff(?:fff)?['"`]/g, msg: 'Pure #fff is banned. Use --paper (#f6f5f2).' },
  ],

  /** Arrows / chevrons — must be solid greyscale triangles, never Unicode. */
  arrows: [
    { re: /[→➔➜➡︎⇨]/g, msg: 'Unicode arrows are banned. Use the <Arrow/> component.' },
    { re: /[←⇦]/g, msg: 'Unicode arrows are banned. Use the <Arrow/> component.' },
    { re: /[↑⇧]/g, msg: 'Unicode arrows are banned. Use the <Arrow/> component.' },
    { re: /[↓⇩]/g, msg: 'Unicode arrows are banned. Use the <Arrow/> component.' },
  ],

  /** Motion — entrance choreography, bounce easing. */
  motion: [
    { re: /\banimate-bounce\b/g, msg: 'Bounce animation is banned.' },
    { re: /\btransition-all\s+duration-(7|8|9|10)\d{2,}\b/g, msg: 'Transitions over 700ms are too slow.' },
    { re: /\bcubic-bezier\s*\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[12]\b/g, msg: 'Bounce/overshoot easing is banned. Use easeOut or easeInOut from tokens.' },
  ],
};

/** Files to skip during audit. */
export const SKIP_PATTERNS = [
  /node_modules/,
  /dist/,
  /build/,
  /\.next/,
  /coverage/,
  /\.git/,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /tsconfig.*\.json$/,
  /vitest\.config\./,
  /vite\.config\./,
  /wrangler\.toml$/,
  /README\.md$/i,
  /LICENSE$/i,
  /NOTICE\.md$/i,
  /\.test\.(ts|tsx|js|jsx)$/,
  /\.spec\.(ts|tsx|js|jsx)$/,
  /__tests__\//,
  /__mocks__\//,
  /packages\/(react|audit|tailwind-preset)\//, // self-audit skip
];

/** Extensions to scan. */
export const SCAN_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.css', '.scss', '.html', '.vue', '.svelte'];

/** File extensions that count as UI-rendering files. Rules that
 *  only make sense for UI (e.g. Unicode arrows, class names) are
 *  scoped to these so a data adapter full of "→" in string literals
 *  doesn't get flagged. */
export const UI_EXTENSIONS = ['.tsx', '.jsx', '.html', '.vue', '.svelte', '.css', '.scss'];

/** Rule ids that only apply to UI files. */
export const UI_ONLY_RULES = new Set(['arrows', 'tailwind']);
