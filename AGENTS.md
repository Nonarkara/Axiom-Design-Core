# Agent Quick-Start — Axiom Design Core

> If you are an AI agent (Claude Code, Cursor, Cline, Continue, Aider, Windsurf, GPT, Copilot, or any other), read this file first. The full operating standard is in [`AXIOM-DNA.md`](AXIOM-DNA.md).

This file is the **5-line spine**. Drop it into any agent's context, ask for any artifact (dashboard, slide, infographic, document, game, narrative, slide-deck, email), and produce something that looks Axiom-correct on the first pass.

> **Read [`BUILDER.md`](BUILDER.md) first.** That file is the method — how the work gets
> made. This file is the law — what a correct surface looks like. Obeying the law without
> the method produces compliant work that is still the wrong thing.

---

## 1. The Equation

**Function first. Subtract. One Divine Move. MoMA Law. Golden Section.**

- **Function first.** Every element earns its place by serving a decision. If it does not inform, move, or mean — cut it.
- **Subtract, then subtract again.** Beauty is what remains after everything that does not work is gone. "Less, but better."
- **The Divine Move** — exactly **one** bold gesture per surface. The one the function already demanded, executed full-size in pure form, until it looks inevitable rather than daring. Never two. Two is noise.
- **MoMA Law** — every edge resolves to another edge. Nothing floats. The grid is invisible because everything snaps to it.
- **Golden Section** — φ = 1.618 in every split, margin, and composition. Never 50/50.

---

## 2. Three Modes — pick by the human's act

| Mode | When | Type | Color | Corners | Density |
|---|---|---|---|---|---|
| **Instrument** | They operate (dashboards, systems, infographics, live tools) | Inter only | grey + blue identity + one red spike | square (0–2 px) | max |
| **Editorial** | They read/think (documents, CVs, essays, reports, decks) | Spectral serif permitted | grey + one accent | square | 60–72 ch measure |
| **Play** | They learn (board/card/flashcard games, workbooks) | either | trunk subsystem permitted | Sato mercy-radius OK | generous, hand-scale |

**Default: Instrument.** It is the most disciplined and the hardest to cheat.

---

## 3. The Color Law (Thai-flag — meaning encoded)

```
Is it DATA (live / critical / down)?  → bare --red. No disc.
Is it IDENTITY (which board / who)?   → enclose it. Blue disc or rule.
Is it DIRECTIONAL (go here / more)?   → greyscale triangle.
None of these?                        → no color. Grey + size.
```

- **Blue is the law** `#26243F` — identity and structure. Always enclosed (disc, plate, rule). Calm, constant.
- **Red is the Move** `#A8322B` — the one spike. Live, critical, decision, negative. Bare. Rare and loud.
- **White is the silence** `#f6f5f2` ground — warm, never pure `#fff`.
- **Grey is the quiet between** — warm near-black ink `#191712` down through a warm grey ramp.
- **Green retired.** Normal/positive data needs no color. The absence of red is the good news. Color appears only at the exception.

If you add color "to liven it up," you have failed every master. Delete it.

---

## 4. The Spines — 4 habits that make every surface look Axiom

These are the design preferences Non Arkaraprasertkul (Dr Non) repeats across every project — Axiom, nsp, MTT, H45, DayTraders. They are the taste layer below the rules.

1. **Balanced.** Every region has weight on both sides of the visual axis. The 12:00 / 6:00 / 3:00 / 9:00 positions all carry signal. A page that reads only "from top-left" is broken.
2. **Compact.** Density is the default. Show more, not less. The air is a reward, not a default. If you can fit a third column without breaking legibility, fit it.
3. **No non-sense.** Cut every word that carries no freight. Cut every shape that has no function. Cut every color that has no signal. Hemingway is the bar. "Bukowski without the alcohol."
4. **Communicative.** Every surface answers the human's next question, not the designer's portfolio. State is visible before action. Vital signs up, controls near, provenance shown.

These four are not the rules — they are the *taste* that makes the rules land.

---

## 5. Voice

Direct. True. Economical — cut every word that carries no freight, as if you paid by the word to send it. Short declaratives. Active voice. Numbers over adjectives. No academic hedging, no pretension, no complexity worn as a costume for intelligence. Directness is not boredom: build the labyrinth, then land the twist. Sound smart by being clear.

**No exclamation marks. No emoji. No "in conclusion". No "overall". No "key takeaway". No "let me walk you through".**

---

## 6. Hard Bans (non-negotiable)

- Gradients, drop shadows, glows, blurs, glassmorphism
- Rounded corners (0–2 px; Sato mercy-radius only in Play mode)
- More than one free accent (one blue identity, one red Move)
- Pure `#000` or pure `#fff`
- Emoji, stock imagery, decorative icons
- Font weights 700+ on data
- Centering dense content
- Entrance animations, scroll reveals, parallax
- Bounce / elastic easing (always)
- Decoration of any kind — decoration is a lie about who we are

---

## 7. The Checklist — run before shipping

```
□ MODE: did you pick Instrument / Editorial / Play by the user's act?
□ FUNCTION: does every element serve a decision? (function buys the right to be seen)
□ SUBTRACTION: what did you remove? If nothing, you haven't finished.
□ BALANCED: does every region have weight on both sides of the visual axis?
□ COMPACT: is the density maximised without breaking legibility?
□ NO NON-SENSE: is every word earning its place?
□ COMMUNICATIVE: does the surface answer the human's next question?
□ TRIPLE LOAD: does every element inform, move, AND mean? If not, cut it.
□ MoMA LAW: does every edge resolve to another edge? Nothing floating?
□ GOLDEN SECTION: is φ in the composition, or did you lazily split in half?
□ THE MOVE: exactly one bold gesture? Function-compelled? Full size? Inevitable, not daring?
□ PRE-COGNITIVE: can it be absorbed in one glance? (a sign read twice has failed)
□ LINED GLASS: is state read instantly, never measured? Feedback under 100 ms?
□ COLOR: grey for normal, blue for identity (enclosed), red for the one exception (bare)?
□ VOICE: direct, true, economical, unpretentious — and still alive?
□ LEGIBILITY: contrast passes? Not signaling by color alone?
□ INEVITABILITY: could the user imagine no rational alternative?
```

---

## 8. Files in this repo

| File | What it is |
|---|---|
| `AGENTS.md` | This file. The 5-line DNA for any AI agent. |
| `CLAUDE.md` | Claude Code quick-start. Same content, agent-specific entry. |
| `USAGE.md` | Install steps for each agent type (Cursor, Cline, Aider, GPT, etc.). |
| `AXIOM-DNA.md` | Full operating standard, 22 sections, every rule, every code example. |
| `README.md` | Human overview, philosophy, lineage, mode selection, quick-start tokens. |
| `tokens.css` | Drop-in CSS variables. |
| `components.html` | Live component gallery. Open in a browser. |
| `quick-start.html` | Minimal page template. Clone and edit. |
| `LICENSE` | MIT. |
| `assets/photos/`, `assets/diagrams/`, `assets/logo/` | Source assets with README naming conventions. |

---

## 9. How to consume this repo

**One-shot (any agent):** clone it into your project, point the agent at `AGENTS.md`.

**Persistent (project-wide):** copy `AGENTS.md` to your project root so the agent loads it on every session.

**Per-agent integration:** see [`USAGE.md`](USAGE.md) for the exact command for Claude Code, Cursor, Cline, Continue, Aider, Windsurf, GPT, Copilot.

---

## 10. Need depth on a specific topic?

| Question | Read |
|---|---|
| How do I pick a color? | `AXIOM-DNA.md` §5 (Color System) |
| What's the Divine Move? | `AXIOM-DNA.md` §14 (The Divine Move — Doctrine of the One Bold Gesture) |
| How do I write Axiom copy? | `AXIOM-DNA.md` §15 (Voice & Language) |
| How do I lay out a dashboard? | `AXIOM-DNA.md` §8 (MoMA Law) + `components.html` |
| When do I add a Sato-warm element? | `AXIOM-DNA.md` §17 (Iconography, Ornament & the Sato Exception) |
| What about accessibility? | `AXIOM-DNA.md` §19 (The Legibility Law) |
| What is the Lined Glass? | `AXIOM-DNA.md` §12 (Interaction & Feedback) |
| How does motion work? | `AXIOM-DNA.md` §13 (Motion) |
| What is the Brand Kit? | `assets/logo/README.md` |
| How do I extend the system? | `AXIOM-DNA.md` §21 (Adjusting the System) |

---

*axiom.nonarkara.org · Non Arkaraprasertkul · Axiom X Co., Ltd. · MIT License.*
