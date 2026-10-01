# @axiom-design/core-react

React 19 + TypeScript components for [Axiom Design Core](https://github.com/Nonarkara/Axiom-Design-Core).

> Function first. Subtract. One Divine Move. MoMA Law. Golden Section.

The philosophy lives in [`AXIOM-DNA.md`](../../AXIOM-DNA.md) at the repo root. This package gives you the **operational layer** — copy-paste components and tokens that snap to the bans, the modes, and the color law.

## Required color decision

Read [COLOR-PRINCIPLES.md](../../COLOR-PRINCIPLES.md) alongside the DNA before
using or overriding these tokens. Complete the
[decision record](../../docs/color-decision-template.md): full viewport,
grayscale value, token roles/area, exact rendered state pairs, visible non-color
cues and source provenance. Palette’s exhibition shares are not dashboard
quotas. `tokens.ink3` matches CSS at `#737069`; small labels need 4.5:1.

These package files implement the system; they do not bundle the complete
rulebook. Package-only consumers should retain a source checkout of
[Nonarkara/Axiom-Design-Core](https://github.com/Nonarkara/Axiom-Design-Core)
and follow its `USAGE.md` companion instructions. The relative document links
above resolve in that checkout. A component unit-test pass does not prove the
consuming app’s colors, opacity, states or accessibility.

## Install

```bash
# pnpm (preferred for the dashboard family)
pnpm add @axiom-design/core-react

# npm
npm install @axiom-design/core-react

# yarn
yarn add @axiom-design/core-react
```

Then import the stylesheet once at app entry:

```tsx
// main.tsx / main.tsx
import '@axiom-design/core-react/styles.css';
```

## Quick start

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
      footer={<span>Axiom v2.0 · 47 live feeds · 2026-09-06 14:00 ICT</span>}
    >
      <Hero label="AQI — Bangkok" value={157} sub="↑ 12.3% vs 7d" />
      <Board>
        <Panel title="Live feeds" meta="47 active">
          <Row k="PM2.5 — Bangkok" v={42} d="-3" />
          <Row k="NO2 — Bangkok" v={28} d="+1" />
        </Panel>
        <Panel title="Top movers">
          <Row k="AAPL" v={187.42} d="+1.4%" tone="neg" />
          <Row k="NVDA" v={612.18} d="+0.8%" />
        </Panel>
      </Board>
    </Cockpit>
  );
}
```

## Component inventory

| Component | Purpose | Notes |
|---|---|---|
| `Cockpit` | Full-page control room shell | topbar + main + footer |
| `TopBar` | Global header | brand + nav + right |
| `Board` | Multi-region auto-fit grid | sibling to Cockpit main |
| `Panel` | Bordered container with header | the unit of composition |
| `Hero` | The one Divine Move per surface | at most one per page |
| `StatCell` | The metric tile | label / value / sub, three variants |
| `Row` | Dense key/value/delta | for ranked lists |
| `Table` | Data table | typed columns, optional zebra |
| `Chip` | Status pill | three variants, optional dot |
| `Disc` | Enclosed identity mark | the address |
| `Arrow` | Greyscale triangle | never colored, never Unicode |
| `Button` | Flat hairline button | three variants |
| `Input` | Single-line text input | with label + hint |
| `Tab` | Tab in a tab list | selected state via border |
| `Toolbar` | Local control row | with `<Toolbar.Sep/>` |
| `Legend` | Color/symbol key | one row, may wrap |

## Tokens

```tsx
import { tokens, HARD_BANS } from '@axiom-design/core-react';

tokens.paper    // '#f6f5f2' — warm off-white, never #fff
tokens.ink      // '#191712' — warm near-black, never #000
tokens.blue     // '#26243F' — THE LAW (identity, enclosed)
tokens.red      // '#A8322B' — THE MOVE (live, critical, bare)
tokens.trunk    // closed 8-color NYCTA palette
```

`HARD_BANS` is the canonical list of patterns the [audit CLI](../audit/) greps for in your project. Use it in your own lint rules.

## Hard bans (enforced by the audit CLI, not by these components)

- Gradients, drop shadows, glows, blurs, glassmorphism
- Rounded corners (0–2px only; 2px is the max, default is 0)
- More than one free accent (one blue, one red)
- Pure-black ink or pure-white page ground; `--panel` instrument faces and measured trunk glyphs are the explicit DNA §5.1 exception
- Emoji, decorative icons, stock imagery
- Font weights 700+ on data
- Centering dense content
- Entrance animations, scroll reveals, parallax; bounce/elastic easing

If you write a component that violates a ban, the audit CLI will catch it. The components here will not.

## Tests

```bash
pnpm test
```

Each component has a Vitest + Testing Library test for the contract (props → DOM). The CSS is not tested — it's a single source of truth in `styles.css`.

## License

MIT. See [LICENSE](../../LICENSE) at the repo root.
