/**
 * Hard bans — patterns that violate the Axiom / Rams × NYCTA design system.
 *
 * Each entry is a regex; matches across the file count as one violation
 * unless otherwise noted in `scope` (e.g. "imports", "class", "css-prop").
 *
 * Comment text is stripped before matching (see scanner.mjs stripComments), so
 * documenting a banned pattern in a comment is not itself a violation. Lines
 * carrying an `// axiom-audit-ignore` directive are skipped entirely.
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
    // Heavy font weights. §6.2's type scale mandates 700 for the section-header
    // label role, and §6.3 scopes the ceiling to "600 for data" — a scope a
    // regex cannot resolve. So 700 is legal (the scale requires it) and 800+ is
    // the error. Banning 700 outright flagged tokens.css 12 times for obeying
    // the type scale.
    { re: /\bfont-bold\b/g, msg: 'font-bold (700) is only legal on the §6.2 section-header label role. On data the ceiling is 600.', severity: 'warn' },
    { re: /\bfont-extrabold\b/g, msg: 'Font weight 800+ is banned. The §6.2 scale tops out at 700 (labels only).' },
    { re: /\bfont-black\b/g, msg: 'Font weight 900 is banned. The §6.2 scale tops out at 700 (labels only).' },
  ],

  /** CSS / inline style violations. Both kebab-case (CSS) and camelCase (React inline styles). */
  css: [
    { re: /linear-gradient\s*\(/g, msg: 'linear-gradient is banned.' },
    { re: /radial-gradient\s*\(/g, msg: 'radial-gradient is banned.' },
    { re: /conic-gradient\s*\(/g, msg: 'conic-gradient is banned.' },
    { re: /\bbackdrop-filter\s*:/g, msg: 'backdrop-filter is banned (no glassmorphism).' },
    { re: /\bbackdropFilter\s*:/g, msg: 'backdrop-filter is banned (no glassmorphism).' },
    { re: /\bfilter\s*:[^;]*\bblur\s*\(/g, msg: 'CSS blur filter is banned.' },
    { re: /\bbox-shadow\s*:[^;]*[1-9]px/g, msg: 'Non-zero box-shadow is banned. Use hairline borders instead.' },
    { re: /\bboxShadow\s*:\s*['"][^'"]*[1-9]px/g, msg: 'Non-zero boxShadow is banned. Use hairline borders instead.' },
    { re: /\bfont-weight\s*:\s*(8\d\d|9\d\d)\b/g, msg: 'Font weight 800+ is banned. The §6.2 scale tops out at 700, labels only.' },
    { re: /\bfontWeight\s*:\s*(8\d\d|9\d\d)\b/g, msg: 'Font weight 800+ is banned. The §6.2 scale tops out at 700, labels only.' },
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
    // The two rules above only matched QUOTED literals, i.e. the JS/JSX form.
    // §20 bans pure #000/#fff outright, and plain CSS writes it unquoted —
    // `color:#fff` sailed through the hard ban in every .css and .html file.
    { re: /(?<![\w-])#000(?:000)?(?![0-9a-fA-F])/g, msg: 'Pure #000 is banned. Use --ink (#191712).' },
    { re: /(?<![\w-])#fff(?:fff)?(?![0-9a-fA-F])/g, msg: 'Pure #fff is banned. Use --paper (#f6f5f2).' },
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
    // Overshoot means a control point leaves the [0,1] band in y — i.e. y > 1.
    // y === 1 is an ordinary fast-out curve. The old pattern matched `,1` and so
    // banned tokens.css's own --ease-out: cubic-bezier(0.23, 1, 0.32, 1) and
    // --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1), then told the author to
    // "use easeOut from tokens" — the tokens it had just flagged.
    { re: /\bcubic-bezier\s*\(\s*[\d.]+\s*,\s*(?:[1-9]\d*\.\d+|1\.\d*[1-9]\d*|[2-9]\d*)\s*,/g, msg: 'Overshoot easing is banned (control-point y > 1). Use --ease-out or --ease-in-out.' },
    { re: /\bcubic-bezier\s*\([^)]*,\s*(?:[1-9]\d*\.\d+|1\.\d*[1-9]\d*|[2-9]\d*)\s*\)/g, msg: 'Overshoot easing is banned (control-point y > 1). Use --ease-out or --ease-in-out.' },
    { re: /\bcubic-bezier\s*\([^)]*,\s*-\s*?[\d.]*[1-9][\d.]*\s*\)/g, msg: 'Undershoot easing is banned (control-point y < 0). Use --ease-out or --ease-in-out.' },
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
