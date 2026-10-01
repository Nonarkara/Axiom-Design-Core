# Color principles — Palette in Axiom

**Required before choosing or changing color in any Axiom mode.** This is the
single Axiom adaptation of [Palette](https://github.com/Nonarkara/palette), read
with [AXIOM-DNA.md §5 and §19](AXIOM-DNA.md). Palette supplies a way to judge
relationships; Axiom supplies the operational meaning. A Palette plate is not
permission to replace the Thai-flag identity or add another free accent.

## 1. Source and boundary

Reviewed upstream revision: `5dbe4ed5774bc68919bc68a809195e9ce2523059`.
The machine-readable pin is [docs/palette-source.json](docs/palette-source.json).

- [Field guide](https://github.com/Nonarkara/palette/blob/5dbe4ed5774bc68919bc68a809195e9ce2523059/PALETTE-FIELD-GUIDE.md): viewport, value, roles, contrast, non-color tests; MoMA and Mama rules
- [Curatorial argument](https://github.com/Nonarkara/palette/blob/5dbe4ed5774bc68919bc68a809195e9ce2523059/ABOUT.md) and [design contract](https://github.com/Nonarkara/palette/blob/5dbe4ed5774bc68919bc68a809195e9ce2523059/context.md): area, neighbor, lightness, sequence; quiet supporting controls
- [Portable export](https://github.com/Nonarkara/palette/blob/5dbe4ed5774bc68919bc68a809195e9ce2523059/app.js): `palette-exhibition/1`, ordered `dominant` / `counter` / `support` / `signal` roles, shares, stable plate URL, source and interpretation
- [License and reuse notices](THIRD_PARTY_NOTICES.md)

**Inherited from Palette:** judge color at viewport scale, remove hue, assign
roles and unequal areas, measure the actual foreground/background, communicate
without hue, preserve the source, and test the main task with a first-time user.

**Axiom-specific:** Instrument / Editorial / Play modes, blue enclosed identity,
rare bare red exception, warm ground, the trunk-family restriction, and the
implementation/release record below. These are not claims about Wada.

Palette's approximately **61.8/38.2** two-field split belongs to its exhibition
composition. Its three- and four-color exports also have unequal shares. Those
shares and role names are Dr Non's software interpretation, not Wada's
prescription. They are references for a study, **not universal dashboard area
quotas**. Axiom's Golden Section remains a composition tool; it does not require
61.8% of an Instrument screen to become blue or red. Function and readable data
determine the actual area budget.

## 2. Give color a job before giving it space

Use existing `tokens.css` values. Write the jobs and intended visual areas into
`context.md` before styling; count occupied regions, not the number of swatches.

| Relationship role | Axiom mapping | Area and behavior |
|---|---|---|
| Dominant field | `--paper`, `--panel` | Most of the reading/operating field; distinguish page from instrument face |
| Counterweight | `--ink`, structure; `--blue` when identity needs enclosure | Text, rules, one board identity; a counterweight need not be a second giant color field |
| Support | `--ink-2`, `--ink-3`, neutral chart ramp | Secondary information and annotation; preserve value hierarchy and labels |
| Rare signal | `--red` | The exception or decision; name its state and keep it scarce |

These roles are an Axiom mapping, not a historical Wada plate. In Instrument,
normal stays grey, identity stays enclosed blue, and the one red spike is bare.
In Editorial, preserve the reading field and one accent. In Play or genuine
5+ board systems, trunk colors may identify families, with names/glyphs and
measured foregrounds. A fourth color is not an invitation to invent a fourth
status. Do not turn Palette's `signal` field into an alarm automatically.

No universal percentages are imposed on data interfaces. Record an approximate
budget for the actual surface and breakpoint, for example: “neutral reading
field dominates; blue is confined to board identities; red occurs only beside
the current exception.” If using numeric shares, state what was counted, make
the shares sum to 100%, and explain how the mobile composition changes.

## 3. The five-step gate, applied to Axiom

1. **Enlarge.** Inspect the entire screen, slide, spread, or board at its real
   size. Inspect the densest state as well as the empty state. A good swatch
   strip does not prove a good surface. Use scale, alignment, position and
   spacing before introducing another colored box.
2. **Remove hue.** Compare color and grayscale views. Can the reader distinguish
   the dominant field, grouping, identity and exception? If gray values merge,
   change value, area, labeling or enclosure. Hue difference alone cannot fix
   it. Grayscale is a diagnostic, not a color-vision-deficiency simulation or a
   substitute for contrast measurements.
3. **Assign roles.** Name each token's job and area. Document any imported plate's
   original role and its Axiom role separately. Keep exported names/values and
   shares as source evidence; map to permitted Axiom tokens rather than silently
   recoloring the system. A new identity palette requires a deliberate design
   decision under DNA §21, not an automatic agent export paste.
4. **Measure the rendered pairs.** Use computed CSS foreground and background,
   resolving inherited variables, opacity, overlays and state styles. Composite
   transparent colors over their actual backdrop first. Check normal, hover,
   focus, selected, error, loading, and any supported theme. For images or
   changing backgrounds, use a controlled solid surface or verify the worst
   adjacent background. Never calculate pure black while rendering warm ink.
5. **Work without color.** Keep visible words, numbers, shapes, line styles or
   placement that convey the same meaning. Pair “Down” with the exception,
   route letters with trunk discs, direct labels with chart series, and a
   visible focus boundary with controls. An `aria-label` alone does not provide
   a visible non-color cue. Test keyboard use, grayscale and 200% zoom.

Body text, small labels and control text need **4.5:1**. The **3:1** text floor
applies only to large text (at least 24 CSS px regular or 18.67 CSS px bold),
not to a 9px micro-label called “UI.” Compare unrounded ratios to the threshold.
Relevant component boundaries, focus indicators and essential graphical
objects need 3:1 against adjacent colors. Decorative separators do not have to
carry that duty: `--line` and `--line-2` are not sufficient by themselves for an
essential control boundary. See the W3C explanations of
[text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html),
[non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
and [use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html).

## 4. Working pairs and a real correction

Opaque sRGB token pairs below are computed by
`packages/audit/test/color.test.mjs`; display rounding does not decide pass/fail.
They are examples on these exact surfaces, not an accessibility certificate.

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `--ink` | `--paper` | 16.43:1 | Primary text |
| `--ink-2` | `--paper` | 4.81:1 | Secondary text |
| `--ink-3` | `--paper` | 4.53:1 | Small labels/meta at full opacity |
| `--ink-3` | `--panel` | 4.94:1 | Small labels inside a cell |
| `--red` | `--paper` | 6.10:1 | Bare exception text with a state label |
| `--paper` | `--red` | 6.10:1 | Selection/decisive control text |
| `--paper` | `--blue` | 13.69:1 | Enclosed identity glyph |
| `--paper` | `--ink` | 16.43:1 | Hub glyph |

`--ink-3` was `#918e84` (3.01:1 on paper). That was insufficient for its actual
9–11px labels. The neutral is now `#737069`; the TypeScript export and copyable
examples agree. Paper, panel, ink, blue, red and trunk identity values are
unchanged. `--panel` is the explicit functional white instrument-face/measured-
glyph exception in DNA §5.1; the page ground remains warm paper. Do not dim this
small-text token with opacity; remeasure any variant.

The trunk palette is not uniformly text-safe. For small glyphs, use `--ink` on
orange/yellow and `--panel` on blue/green/purple/grey/brown. Red trunk `#EE352E`
does not reach 4.5:1 with either `--ink` or `--panel`: put the small route label
outside the field on paper, or use a qualifying large glyph and test it at
3:1. This does not change the trunk identity color. `--paper` is not a safe
substitute for `--panel` on green or brown at small sizes.

The CLI checks named opaque token pairs in `tokens.css`. It does not run a
browser, infer every adjacent color, or composite component opacity. The tests
also guard the checked examples, TypeScript token parity and adoption links.
Browser inspection and task testing remain release requirements.

## 5. Copy this decision record, not a loose palette

Add this block to the consuming project's `context.md`, alongside its Design
Read. Replace every bracket; record “not used” rather than inventing a plate.

Use [the reusable decision record](docs/color-decision-template.md). Keep the
record with the project so the next agent can recover the choice and its tests.

Agent brief: “Read `AGENTS.md`, `AXIOM-DNA.md` §5/§19 and
`COLOR-PRINCIPLES.md`. Preserve Axiom's identity. Complete the color decision
record before styling. Inspect viewport and grayscale composition; measure
actual rendered state pairs; keep visible non-color cues. Report untested gates
and failures explicitly.”

If a real plate is used, retain its exact stable live URL (for example,
`https://colors.nonarkara.org/#plate-087` is an illustrative reference, **not**
the source of Axiom's existing colors), exported names/hex values, upstream
commit and adaptation. Credit Sanzo Wada for the historical relationship, Matt
DesLauriers / Dain M. Blodorn Kim for the digital-data lineage, and Dr Non
Arkaraprasertkul for the exhibition interpretation. Screen conversions are not
exact printed inks. Roles, proportions and computed moods are not Wada's words.
Preserve the relevant notices if copying code, prose or data; never invent a
plate number, affiliation or printed-color claim.

## 6. Release acceptance

- [ ] The mode, jobs, area budget and provenance are in `context.md`
- [ ] Full-size color and grayscale evidence exists at 375, 768 and 1280 CSS px
      for web, or the intended output size for another medium
- [ ] Exact state pairs pass their applicable thresholds, including small labels
      and any opacity; failing pairs are corrected, not rounded into a pass
- [ ] Names, selection, status and chart meaning survive without hue
- [ ] Keyboard focus is visible; 200% zoom and reduced motion remain usable
- [ ] An older, nontechnical first-time visitor can identify the purpose, perform
      the main action, recognize success and recover from an ordinary mistake
      without coaching (Palette's Mama Rule); record who/when/outcome, or pending
- [ ] Source and built-output audit ran where applicable; browser checks and a
      real human walkthrough are separately reported, never inferred from CI

Run the repository checks without installing a package:

```bash
node packages/audit/bin/axiom-audit.mjs . --strict
node --test packages/audit/test/*.test.mjs
```

For a Palette upgrade, review the pinned source changes, update this adaptation
and notices as needed, and rerun the checks and affected visual/task tests.
Do not follow a moving upstream `main` automatically.
