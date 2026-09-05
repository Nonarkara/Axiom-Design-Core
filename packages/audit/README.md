# @axiom-design/audit

A CLI that scans any project for violations of the [Axiom / Rams × NYCTA hard bans](../../AXIOM-DNA.md). This is the operational layer that catches "template-looking" patterns before they ship.

## What it catches

| Category | Examples |
|---|---|
| **Tailwind utilities** | `rounded-md`, `rounded-2xl`, `shadow-md`, `shadow-lg`, `bg-gradient-to-r`, `backdrop-blur`, `text-red-500`, `font-bold` |
| **CSS** | `linear-gradient(`, `radial-gradient(`, `box-shadow: 0 2px 4px`, `border-radius: 8px`, `font-weight: 700`, `backdrop-filter:` |
| **Colors** | Pure `#000` and `#fff`; any hardcoded hex (warning, not error) |
| **Arrows** | Unicode arrows (`→ ➔ ⇨`) — must use the `<Arrow/>` component |
| **Motion** | Bounce animation, transitions over 700ms, overshoot easing curves |

Lines that opt out via `// axiom-audit-ignore` or `// axiom-audit-ignore-next-line` are skipped — use sparingly, with a comment explaining why.

## Install

```bash
# As a dev dependency in your project
pnpm add -D @axiom-design/audit
```

Or run directly with `npx` from any directory containing the package.

## Usage

```bash
# Scan the current directory
npx axiom-audit .

# Scan a specific app
npx axiom-audit ./apps/web

# Strict mode — exit non-zero on any error (for CI)
npx axiom-audit ./apps/web --strict

# Machine-readable output
npx axiom-audit . --json | jq '.errors'
```

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Clean (or warnings only in non-strict mode) |
| 1 | Errors found |
| 2 | Invalid usage or scan failure |

## Skipped paths

The audit automatically skips:

- `node_modules/`, `dist/`, `build/`, `.next/`, `coverage/`, `.git/`
- Lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`)
- Config files (`tsconfig*.json`, `vitest.config.*`, `vite.config.*`, `wrangler.toml`)
- Test files (`*.test.*`, `*.spec.*`, `__tests__/`, `__mocks__/`)
- `README.md`, `LICENSE`, `NOTICE.md`
- The design system packages themselves (`packages/react/`, `packages/audit/`, `packages/tailwind-preset/`)

## CI integration

```yaml
# .github/workflows/audit.yml
name: design-system-audit
on: [pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npx @axiom-design/audit . --strict
```

## When to use `--strict`

- **Local dev** — default (report only) so agents can iterate
- **CI / pre-merge** — `--strict` to block PRs that introduce a template pattern
- **Audits of existing repos** — default, then opt into `--strict` per project as it gets clean

## License

MIT. See [LICENSE](../../LICENSE) at the repo root.
