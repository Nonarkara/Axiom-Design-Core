# Photo Assets

Drop photos here. Every photo in this folder is available for use across Axiom surfaces.

## Naming Convention

```
[context]-[description]-[number].jpg
```

Examples:
- `hero-bangkok-skyline-01.jpg`
- `case-study-phuket-dashboard-01.jpg`
- `team-non-portrait-01.jpg`
- `event-gitex-asia-2026-01.jpg`
- `system-kuching-ioc-01.jpg`

## Folder Context Tags

| Context | Use |
|---|---|
| `hero-` | Full-bleed hero backgrounds (min 1920×1080, 16:9 or 21:9) |
| `case-study-` | System / project thumbnails (min 800×600) |
| `team-` | People portraits (min 600×600, square aspect preferred) |
| `event-` | Conference / summit / field photos |
| `system-` | Screenshots of running systems (use Playwright, min 1280×800) |
| `city-` | City / location photography (min 1200×800) |
| `field-` | Fieldwork, research, on-site |

## Rules

- **Real photos only.** No AI-generated imagery, no stock filler.
- **No duplicates across surfaces.** Each section gets its own distinct image.
- **Beautiful enough to earn its place.** Ask: would this image appear in a design magazine?
- **Format:** JPEG for photos, PNG for screenshots and assets with transparency.
- **Do not compress below 85% JPEG quality.** Retain as much detail as possible.
- **Provenance:** note the credit in `credits.md` in this folder. If you don't know the source, ask.

## Usage in HTML

```html
<!-- Hero with legibility overlay (the only permitted gradient) -->
<div style="position:relative; background:url('./assets/photos/hero-xxx.jpg') center/cover;">
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(25,23,18,.7));"></div>
  <div style="position:relative;color:#fff;"> ... </div>
</div>
```

The dark-to-transparent overlay is the only sanctioned gradient. It exists for text legibility, not decoration.
