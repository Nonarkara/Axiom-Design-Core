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
    { re: /\bfont-weight\s*:\s*(8\d\d|9\d\d)\b/g, msg: 'Font weight 800+ is banned. The §6.2 scale tops out at 700, and only for a label or button role — never a data value.' },
    { re: /\bfontWeight\s*:\s*(8\d\d|9\d\d)\b/g, msg: 'Font weight 800+ is banned. The §6.2 scale tops out at 700, and only for a label or button role — never a data value.' },
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
    // Overshoot means a control point leaves the [0,1] band in y. y === 1 is an
    // ordinary fast-out curve: the old pattern matched `,1` and so banned
    // tokens.css's own --ease-out: cubic-bezier(0.23, 1, 0.32, 1), then told the
    // author to "use easeOut from tokens" — the token it had just flagged.
    // These two test the y params POSITIONALLY — y1 is the 2nd argument, y2 the
    // 4th — so a legal x outside the band is not mistaken for an illegal y.
    { re: /\bcubic-bezier\s*\(\s*-?[\d.]+\s*,\s*(?:-[\d.]+|1\.\d+|[2-9][\d.]*)\s*,/g, msg: 'Bounce/overshoot easing is banned (y1 outside 0..1). Use --ease-out or --ease-in-out.' },
    { re: /\bcubic-bezier\s*\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,\s*(?:-[\d.]+|1\.\d+|[2-9][\d.]*)\s*\)/g, msg: 'Bounce/overshoot easing is banned (y2 outside 0..1). Use --ease-out or --ease-in-out.' },
  ],

  /** ---------------------------------------------------------------
   *  ORIGIN TELLS — added 2026-09-08 (PR #3).
   *
   *  The bans above catch decoration. These catch *provenance*: the
   *  cluster of defaults that lets a stranger identify a surface as
   *  agent-generated from a screenshot.
   *
   *  No single hit here condemns a page. The tell is the stack.
   *  See ANTI-TEMPLATE.md. The View-Source half of the same layer —
   *  generator meta tags, builder hosts, dev-server URLs, key
   *  literals, client-side vendor calls — lives in spine.mjs, which
   *  already owned secrets and exposure.
   *  --------------------------------------------------------------- */

  /** The typefaces every generator reaches for. The #1 visual tell. */
  fonts: [
    { re: /family=(Inter|Roboto|Poppins|Montserrat|Open\+Sans|Lato|Geist|Space\+Grotesk|Instrument\+Serif|Manrope|DM\+Sans)\b/g, msg: 'Banned template font in a Google Fonts URL. See ANTI-TEMPLATE.md §2.1.' },
    { re: /['"](Inter|Roboto|Poppins|Montserrat|Open Sans|Lato|Geist|Space Grotesk|Instrument Serif|Manrope|DM Sans)['"]/g, msg: 'Banned template font. These are the faces every AI reaches for; a reader clocks them at ten metres.' },
    { re: /font-family\s*:\s*system-ui\b/g, msg: 'system-ui as the primary face is a generator default. Name a real typeface.' },
    { re: /fontFamily\s*:\s*['"]system-ui/g, msg: 'system-ui as the primary face is a generator default. Name a real typeface.' },
  ],

  /** "VibeCode purple" and the Tailwind default blue — the most-cited palette tells. */
  slopColors: [
    { re: /#(?:6366f1|818cf8|a5b4fc|8b5cf6|a855f7|7c3aed|6d28d9|4f46e5|7e22ce|c084fc|d946ef|e879f9)\b/gi, msg: 'VibeCode purple/indigo/violet. The single most-cited AI-slop colour family.' },
    { re: /#(?:3b82f6|2563eb|60a5fa|1d4ed8)\b/gi, msg: 'Tailwind default blue. Banned by house law (§14).' },
    { re: /\bbg-clip-text\b/g, msg: 'Gradient text on headings is a generator default.' },
    { re: /-webkit-background-clip\s*:\s*text/g, msg: 'Gradient text on headings is a generator default.' },
  ],

  /** Layout reflexes. Judgment calls — warnings, not errors. */
  layout: [
    { re: /\bgrid-cols-3\b/g, msg: 'Three-equal-card row is the most recognisable AI layout. Legitimate only if the content is genuinely three peers.', severity: 'warn' },
    { re: /\btext-center\b/g, msg: 'Centred content is the generator default. Dense content is never centred (house law).', severity: 'warn' },
    { re: /\bbento\b/gi, msg: 'Bento grid is a 2024–2026 generator default.', severity: 'warn' },
    { re: /(?:Now in Beta|Coming Soon|Powered by AI|✨)/gi, msg: 'Sparkle/beta pill. Filler chrome.', severity: 'warn' },
    { re: /['">]\s*(?:99\.9%|99%|100%|10k\+|1M\+|10x|24\/7)\s*['"<]/gi, msg: 'Fake-precision stat banner. Every number carries source, tier and age (§16.1 Law 3) or it does not ship.', severity: 'warn' },
  ],

  /** Marketing-copy tells. Warnings — the writer decides. */
  copy: [
    { re: /\b(?:seamless(?:ly)?|cutting-edge|game-chang\w+|revolutioni[sz]\w+|supercharg\w+|unlock the power|transform your|elevate your|innovative solution\w*|robust solution\w*|delve|tapestry|leverage the)\b/gi, msg: 'Buzzword tell. Plain words, or cut it (§12.4 / Dr-Non-Write).', severity: 'warn' },
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
export const UI_ONLY_RULES = new Set(['arrows', 'tailwind', 'layout', 'copy']);
