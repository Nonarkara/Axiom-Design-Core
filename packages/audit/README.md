# @axiom-design/audit

Audits a project against **both halves** of the Axiom core in one pass.

| Layer | Source | Checks |
|---|---|---|
| `front` | `AXIOM-DNA.md`, `ANTI-TEMPLATE.md` | radius, shadow, gradient, blur, palette, weights, arrows, motion, pure `#000`/`#fff`, and the origin tells: template fonts, slop palette, gradient text, layout and copy reflexes |
| `back` | `AXIOM-SPINE.md` | secret literals, fabricated data on a data path, empty catch, SQL interpolation, model keys in client bundles, green-washed gates, and the View-Source origin tells: generator meta tags, builder hosts, dev-server URLs |
| `seam` | `AXIOM-SPINE.md §9` | `tokens.css` contrast vs `§19` (computed), provenance headers produced vs consumed, token drift, eyebrow ratio |

```bash
npx axiom-audit .                  # advisory — reports, exits 0
npx axiom-audit . --strict         # CI — exits 2 on errors
npx axiom-audit . --json           # machine-readable
npx axiom-audit . --no-seam        # per-line layers only
npx axiom-audit dist               # built output — the provenance tells live in the bundle
```

**Exit codes** — an operational failure and a design finding are different
events and do not share a code (shape borrowed from `pbakaus/impeccable`):

| Code | Means |
|---|---|
| `0` | scan completed; clean, or findings in advisory mode |
| `1` | the scan could not run — bad path, nothing scannable |
| `2` | scan completed, errors found, `--strict` was passed |
| `3` | invalid usage |

**Waivers must say why.** A directive with no reason is itself reported, so the
exception register for a whole project is `grep -rn axiom-audit-ignore`:

```css
/* axiom-audit-ignore-next-line colors -- a palette page prints its own token values */
```

**Borrowed mechanisms**, with thanks: exit-code contract and reasoned waivers
from [impeccable](https://github.com/pbakaus/impeccable); real WCAG contrast
maths and the recompute-don't-assert habit from
[ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill);
the countable eyebrow ratio from
[taste-skill](https://github.com/leonxlnx/taste-skill); backend layer taxonomy
from [Understand-Anything](https://github.com/Egonex-AI/Understand-Anything).
The provenance seam is ours — every system surveyed was frontend-only, so none
of them had a seam to check.

---

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

# Strict mode — exit 2 on any error (for CI)
npx axiom-audit ./apps/web --strict

# Machine-readable output
npx axiom-audit . --json | jq '.errors'
```
