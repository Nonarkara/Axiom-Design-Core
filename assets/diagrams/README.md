# Diagram Assets

Drop diagrams, architecture charts, flow diagrams, and wireframes here.

## Naming Convention

```
[type]-[subject]-[version].svg
```

Examples:
- `arch-system-overview-v1.svg`
- `flow-deploy-pipeline-v2.svg`
- `map-asean-coverage-v1.svg`
- `wire-dashboard-hero-v1.png`
- `infographic-slic-methodology-v3.svg`

## Diagram Types

| Type | Use |
|---|---|
| `arch-` | System architecture, infrastructure diagrams |
| `flow-` | Process flows, decision trees, pipelines |
| `map-` | Geographic, spatial, coverage diagrams |
| `wire-` | Wireframes, layout sketches |
| `infographic-` | Data visualization, methodology illustrations |
| `chart-` | Charts that aren't part of a live data system |
| `timeline-` | Chronological diagrams, roadmaps |

## Format Rules

- **SVG preferred** for everything geometric (scales cleanly at any size)
- **PNG** only when SVG isn't available (screenshot diagrams, etc.) — min 2× resolution
- **Color palette from tokens.css** — never introduce new colors in diagrams
- Diagrams use `--ink`, `--ink-2`, `--line` for structure, `--blue` for identity, `--red` for the one signal
- No gradients, no shadows, no rounded corners (unless Sato mercy-radius documented)
- Diagrams follow MoMA Law: every edge resolves to another edge

## Embedding

```html
<!-- Inline SVG (preferred — inherits CSS variables) -->
<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- fill="var(--ink)" works when SVG is inline -->
</svg>

<!-- IMG embed (does not inherit CSS variables — use hex values in SVG) -->
<img src="./assets/diagrams/arch-xxx.svg" alt="System architecture overview" width="600">
```
