# Wire-In — drop Axiom into a project in 5 minutes

This is the operational story for any dashboard that wants to consume Axiom Design Core. Three layers, install once, ship forever.

## 1. Install the three packages

```bash
pnpm add @axiom-design/core-react
pnpm add -D @axiom-design/tailwind-preset @axiom-design/audit
```

## 2. Import the stylesheet once

In your `main.tsx` (or wherever the React tree is mounted):

```tsx
import '@axiom-design/core-react/styles.css';
```

This brings in all CSS variables (`--paper`, `--ink`, `--blue`, `--red`, the trunk palette, the type scale, the spacing ramp, the motion tokens) and the component class definitions.

## 3. Wire the Tailwind preset (if you use Tailwind)

In `tailwind.config.js`:

```js
import axiomPreset from '@axiom-design/tailwind-preset';

export default {
  presets: [axiomPreset],
  content: ['./src/**/*.{ts,tsx,html}'],
};
```

This maps the tokens to Tailwind utilities AND removes the hard-banned utilities (`rounded-md`, `shadow-lg`, `bg-gradient-to-*`, `backdrop-blur-*`, `font-bold`) from the generated CSS. A developer who writes `rounded-md` literally gets `border-radius: 0`.

## 4. Run the audit

```bash
# Scan your project
npx axiom-audit ./apps/web

# Strict mode for CI (fails the build on errors)
npx axiom-audit ./apps/web --strict

# Machine-readable
npx axiom-audit . --json | jq '.errors'
```

Expected on a clean Axiom project:

```
axiom-audit  scanning ./apps/web
42 files scanned · 0 errors · 0 warnings
✓ Clean.
  No hard-bans detected. Function first, subtract, one Divine Move.
```

## 5. Use the components

```tsx
import { Cockpit, TopBar, Disc, Chip, Hero, Board, Panel, Row, StatCell } from '@axiom-design/core-react';

export function App() {
  return (
    <Cockpit
      topbar={
        <TopBar
          brand={<><Disc>A</Disc> Axiom Cockpit</>}
          links={[
            { href: '/', label: 'Cockpit', current: true },
            { href: '/signals', label: 'Signals' },
            { href: '/sources', label: 'Sources' },
          ]}
          right={<Chip dot variant="signal">6 APIs down</Chip>}
        />
      }
      footer={<span>v2.0 · 47 live feeds · 2026-09-06 14:00 ICT</span>}
    >
      <Hero label="AQI — Bangkok" value={157} sub="↑ 12.3% vs 7d" />
      <Board>
        <Panel title="Live feeds" meta="47 active">
          <Row k="PM2.5 — Bangkok" v={42} d="-3" />
          <Row k="NO2 — Bangkok" v={28} d="+1" />
        </Panel>
        <Panel title="Top movers">
          <Row k="AAPL" v={187.42} d="+1.4%" tone="neg" />
        </Panel>
      </Board>
    </Cockpit>
  );
}
```

## What you give up

- Material / antd / shadcn opinionated themes. Use the Axiom components, not the third-party ones.
- All rounded corners, shadows, gradients, blur, and font-weight 700+. If you need them, you have failed the law.
- Default Tailwind colors. The preset replaces them with the Axiom palette.

## What you keep

- React 19 + Vite, your existing build, your existing routing, your existing data layer.
- Full a11y — the components are real HTML elements with `aria-*` attributes, not `<div>` soup.
- Tests — the audit catches regressions; Vitest in the package catches component contract changes.

## CI integration

```yaml
# .github/workflows/audit.yml
name: axiom-audit
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: pnpm install
      - run: pnpm exec axiom-audit ./apps/web --strict
```

The audit runs in 2 seconds. A PR that introduces a rounded corner blocks the merge.

## Worked example — kmitl-control-tower

```bash
# from a fresh clone of kmitl-control-tower
pnpm add @axiom-design/core-react
pnpm add -D @axiom-design/tailwind-preset @axiom-design/audit
npx axiom-audit ./apps/web
```

Expected output (today, before any swap):

```
axiom-audit  scanning ./apps/web
151 files scanned · 258 errors · 181 warnings
apps/api/src/routes/dtScore.ts
  ✗   221:167  border-radius ≥ 3px is banned.  `border-radius: 6px`
  ✗   222: 73  Font weight 700+ is banned on data.  `font-weight: 700`
  …
```

These are real template-looking patterns in the existing kmitl repo. The audit surfaces them. The wire-in's job is to use the components, and as a side effect the template patterns disappear (the components snap to the system).

## Why three packages, not one

- **`@axiom-design/core-react`** — runtime. React components + stylesheet. Goes in your `dependencies`.
- **`@axiom-design/tailwind-preset`** — build-time. Tailwind theme + utility gating. Goes in `devDependencies` (only if you use Tailwind).
- **`@axiom-design/audit`** — dev-time. CLI for catching regressions. Goes in `devDependencies`. Optional in production.

Each can be installed, updated, and versioned independently. The audit can also be a global `pnpm dlx` or a `npx` one-shot, no project install required.
