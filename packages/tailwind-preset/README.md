# @axiom-design/tailwind-preset

A Tailwind preset that wires the [Axiom Design](../../AXIOM-DNA.md) tokens into Tailwind's theme — and **removes the hard-banned utilities** so a developer cannot accidentally smuggle in template chrome.

## What you get when you use this preset

- **Colors:** `paper`, `panel`, `ink`, `ink-2`, `ink-3`, `line`, `line-2`, `blue` (THE LAW), `red` (THE MOVE), plus the 8 NYCTA trunk colors as `trunk-blue`, `trunk-orange`, etc.
- **Spacing:** the 11px-base ramp (`1.5`=6px, `2.5`=11px, `4`=13px, `6`=16px, `7`–`10`=22px, `16`=44px, `24`=88px).
- **Border radius:** only `none` (default) and `axiom-2` (2px). `rounded-md`, `rounded-2xl`, etc. all resolve to 0px.
- **Box shadow:** only `none`. `shadow-md` and friends compile to nothing.
- **Font weight:** only 400 / 500 / 600. `font-bold` does not exist.
- **Motion:** `ease-axiom-out`, `ease-axiom-in-out`, `duration-press` (100ms), `duration-state` (150ms), `duration-layout` (250ms).
- **Disabled utilities:** `bg-gradient-to-*`, `backdrop-blur-*`, `blur-*`, `drop-shadow-*`. They simply don't generate.

If a developer writes `rounded-md`, Tailwind still parses it — it just renders as 0px, which is the Axiom default. If a developer writes `shadow-lg`, the class doesn't exist in the generated CSS. The audit CLI in `packages/audit/` greps source for the patterns regardless.

## Install

```bash
pnpm add -D @axiom-design/tailwind-preset tailwindcss
```

## Usage

```js
// tailwind.config.js
import axiomPreset from '@axiom-design/tailwind-preset';

export default {
  presets: [axiomPreset],
  content: ['./src/**/*.{ts,tsx,html}'],
};
```

## Why a preset, not a config?

A preset composes with your own `theme.extend`. You can still add project-specific tokens (e.g. a `--parking-rate` for the Bangkok dashboard) by extending the theme after the preset.

```js
import axiomPreset from '@axiom-design/tailwind-preset';

export default {
  presets: [axiomPreset],
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'parking-rate': 'var(--parking-rate)',
      },
    },
  },
};
```

## Pair with the audit CLI

The preset removes the utilities at build time. The audit CLI in `packages/audit/` greps source for the patterns regardless. Use both — preset for "the class doesn't render" + audit for "the developer stopped writing the class."

```bash
npx axiom-audit ./apps/web --strict
```

## License

MIT. See [LICENSE](../../LICENSE) at the repo root.
