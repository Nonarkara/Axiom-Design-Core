# ANTI-TEMPLATE — how not to look agent-generated

> Added 2026-09-08. The bans in `AGENTS.md` §6 catch decoration. This file catches **provenance** — the cluster of defaults that lets a stranger identify a surface as agent-built from a screenshot or a View-Source.
>
> Enforced by `npx axiom-audit . --strict`. The prose here is the reasoning; the audit is the gate.

---

## 1. The stack doctrine

**No single tell condemns a page. The stack does.**

One rounded corner is a choice. Inter is a font. A centred hero is a layout. But *Inter plus a purple gradient plus three identical cards plus "seamlessly transform your workflow" plus a `border-radius: 12px`* is a fingerprint, and anyone who has seen thirty generated sites reads it in under a second.

This matters because it changes what "compliance" means. A surface can pass every individual ban and still be obviously generated, because the tells that remain are the ones no rule named. Conversely a surface can break a rule deliberately and read as authored, because the break is load-bearing and everything around it is specific.

So the question at ship time is not *did I violate a rule.* It is:

> **Would someone who has seen thirty agent-built sites place this one among them?**

Score the stack, not the item.

---

## 2. The tell registry

### 2.1 Typography — the single strongest visual tell

Banned outright: **Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Geist, Space Grotesk, Manrope, DM Sans, Instrument Serif**, and `system-ui` as a primary face.

These are what every model reaches for. Inter is the worst offender because it is genuinely good — which is why it is everywhere, and why it now signals *nobody chose this.*

**This repo shipped Inter as `--font-sans` until 2026-09-08.** A design core that ships the most-cited tell teaches every consuming project to wear the same uniform. That was the largest single source of templated-ness in the estate, and it came from here. Now: `Source Sans 3` (Axiom) / `Helvetica Neue` (Rams — already the canonical Braun voice, and system-resident, so no web font at all).

### 2.2 Colour

- **VibeCode purple** — any indigo/violet/purple gradient or accent (`#6366f1 #8b5cf6 #a855f7 #7c3aed …`). The most-cited palette tell of the era.
- **Tailwind default blue** `#3b82f6` — already banned by house law.
- Gradient text on headings (`bg-clip-text`).
- Neon accents on near-black; cyan-on-dark.

### 2.3 Provenance — visible in View-Source, invisible in a screenshot

Two of these — key literals and client-side vendor calls — are `AXIOM-SPINE.md`
§7 and §8, and the back half enforces them. The other three were unchecked:

- `<meta name="generator">` naming the builder.
- Builder hosts left in source: `lovable.app`, `bolt.new`, `v0.dev`, `.framer.app`.
- Client-side calls to `api.anthropic.com` / `api.openai.com` — which also leaks the key.
- API-key literals (`sk-ant-…`, `sk-…`, `AIza…`). A key that touched history is burned, not deleted.
- `localhost:5173` / `127.0.0.1` references shipped to production.

Run the audit against built output too — `axiom-audit dist` — because this layer lives in the bundle, not the source.

### 2.4 Layout reflexes

- Three identical feature cards in a row.
- Centred everything.
- Equal-weight card grids with no hierarchy — every card interchangeable.
- Nested cards. If a card sits inside a card, one of them should not be a card.
- Numbered `01 / 02 / 03` steps as the main section rhythm.
- Fake-precision stat banners: `99.9%`, `10k+`, `24/7`, with no source.
- Sparkle / "Now in Beta" / emoji pills.
- Bento grids.
- Glassmorphism used decoratively.
- **Multi-screen sameness** — every screen a slight variation of the same card grid instead of a purpose-built flow. This is the dashboard-specific tell, and the one this estate is most exposed to.

### 2.5 Copy

Deferred to the workspace `no-ai-tells` rules. The audit flags the worst offenders — *seamless, cutting-edge, transform your, unlock the power, elevate your, revolutionise, supercharge, delve, tapestry.*

---

## 3. The trap zone — where this system's own discipline is now the default

Read this part twice. It is the reason a fully compliant surface can still look generated.

The 2026 "tasteful" generated default is no longer purple gradients. It is **restraint**: warm off-white or cream ground, a serif accent, hairline rules, tracked-out uppercase eyebrows, a single muted accent, generous whitespace, near-black-and-one-colour dashboards.

That is a description of this design core.

The convergence is real and it is not this system's fault — the models learned restraint from the same canon (Rams, Vignelli, Swiss grid) that this system descends from. But the consequence is concrete: **obedience alone no longer differentiates.** The tells this system bans are the ones the previous generation of generators had. The look this system mandates is what the current generation produces.

Specific overlaps to be conscious of:

| This system's rule | What it now shares with the default |
|---|---|
| Warm off-white ground (`#f6f5f2` / `#faf9f7`) | Cream/beige ground is the 2026 "tasteful" default |
| Hairline rules, no shadows | Broadsheet hairline layouts are a named AI tell |
| Tracked uppercase micro-labels | "Template chrome" — tracked ALL-CAPS eyebrows |
| Middle-dot meta strings (`A · B · C`) | Named as template chrome |
| Near-black + one accent | The current dark-dashboard default |

**The response is not novelty.** Adding a gradient to prove a human made it is the same failure in the other direction. The response is §4: the parts of the craft a generator skips because nothing forces it to.

---

## 4. The positive half — bans alone do not work

A page defined only by what it avoids converges on the average of what remains. Every surface therefore commits to four things, written down before the first line of CSS.

### 4.1 The Design Read — one sentence, before any code

> *"Quiet editorial. High-contrast ink on cream. Strong hierarchy, asymmetric, one dominant number per section."*

Name it in the project's `context.md`. If it could describe any other surface in the estate, it is not specific enough yet.

### 4.2 A named reference

Not "clean and modern" — unenforceable. Name a real artifact: *the Braun ET66*, *the 1972 Vignelli subway diagram*, *MoMA's own site*, *a Linear product page*, *a specific magazine spread*. An agent can reason about a named reference. It cannot reason about an adjective.

### 4.3 The MoMA rules — the layout standard

Extracted from moma.org, at Dr Non's direction:

1. **Clean and visually stunning.** Minimal is the floor, not the goal.
2. **Lines carry different weights when they play different roles.** A structural divider is not a cell separator is not an emphasis rule. Uniform 1px hairlines everywhere is itself a flatness tell — it says no one decided which line mattered.
3. **Invisible grid — everything locks in.** Nothing left hanging. Every edge resolves to another edge.
4. **Spacing is compact and beautiful.** No lingering, no drifting whitespace.
5. **Simple mechanics, simple movements.** Motion confirms, never performs.
6. **Classy colour.** Restraint over range.
7. **Consistency is the gold standard.** One decision, applied everywhere.

### 4.4 Hierarchy and asymmetry — the anti-sameness levers

- **One element dominates each section.** Secondary metrics shrink. A grid where everything is the same weight is a grid where nothing was decided.
- **Never a 50/50 split.** Golden section, or 2/3 + 1/3.
- **Hero content sits off-centre** — columns 2–8, not centred.
- **Vary card sizes** when the content genuinely differs in importance. Equal cards are only correct for genuine peers.
- **Every value from a token.** No hard-coded hex, no raw pixel spacing.

### 4.5 Rejected recommendation, recorded

A widely-circulated anti-slop prompt advises *"prefer atmosphere — subtle texture, layered backgrounds, geometric patterns — over flat solid colours."*

**Rejected.** It contradicts this system's materials rule (surfaces do not pretend to be things they are not) and the workspace ban on decorative texture behind text. Atmosphere here comes from type, spacing and hairline weight, never from applied texture. Recorded so the recommendation is not re-adopted by a later agent who has only seen the prompt.

---

## 5. The gate

```bash
npx axiom-audit .            # source
npx axiom-audit dist         # built output — the provenance layer lives here
npx axiom-audit . --strict   # CI: exit 2 on errors (1 = the scan could not run)
```

`error` = unambiguous violation, fails CI. `warn` = judgment call, a human decides.

Then answer, in writing, before shipping:

```
□ DESIGN READ    — one sentence, in context.md. Specific to this surface.
□ REFERENCE      — a named real artifact, not an adjective.
□ DOMINANCE      — which single element dominates? Name it.
□ ASYMMETRY      — where is the split that is not 50/50?
□ LINE WEIGHTS   — do rules differ by role, or is everything 1px?
□ THE STACK      — would a stranger place this among thirty generated sites?
□ AUDIT          — axiom-audit . --strict exits 0, and dist is clean.
```

An unchecked box is not a style opinion. It is unfinished work.
