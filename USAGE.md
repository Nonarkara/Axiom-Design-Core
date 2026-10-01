# USAGE.md — Install Axiom Design Core in your agent

Three ways to consume this repo, depending on your agent and your workflow.

---

## 0. Pick the install method

| Method | When | Effort |
|---|---|---|
| **One-shot** | You're asking the agent to design one thing right now. | 30 s |
| **Persistent (project-wide)** | You're shipping a project and want every session to use Axiom. | 2 min |
| **Persistent (global)** | You want Axiom in every project you ever open with this agent. | 2 min |

The method that works for **every** agent is the **`AGENTS.md` standard** (from [agents.md](https://agents.md)). One file, one location, every agent picks it up.

---

## 1. One-shot — any agent, any project

```bash
git clone https://github.com/Nonarkara/Axiom-Design-Core.git design-core
cd <your-project>
```

Then tell your agent:

> "Read `design-core/AGENTS.md` and `design-core/COLOR-PRINCIPLES.md`. Complete the color decision record in `context.md`, then apply the Axiom design system using `design-core/tokens.css`."

The agent reads `AGENTS.md` for the spine, then `AXIOM-DNA.md` for depth as needed.

---

## 2. Persistent (project-wide) — every session loads it

Keep the checkout as `design-core/` when possible and point your existing agent
instructions at it. If copying files, install the whole required companion
bundle; do not leave `COLOR-PRINCIPLES.md` or its provenance behind. Merge with
existing agent instructions rather than overwriting project rules.

From the target project:

```bash
git clone https://github.com/Nonarkara/Axiom-Design-Core.git design-core
# Merge this reference into your existing root AGENTS.md:
# Read design-core/AGENTS.md and design-core/COLOR-PRINCIPLES.md before design.
# Use design-core/docs/color-decision-template.md for the project record.
```

The root entry point now routes to the retained checkout, where relative links
resolve. Do not overwrite the project’s own license or existing instructions.
For a copied bundle instead of a checkout, keep `AGENTS.md`, `CLAUDE.md`,
`BUILDER.md`, `ANTI-TEMPLATE.md`, `AXIOM-DNA.md`, `AXIOM-SPINE.md`,
`COLOR-PRINCIPLES.md`, `THIRD_PARTY_NOTICES.md`, `LICENSE`, `tokens.css`,
`components.html` and `quick-start.html` together under `design-core/`, with
`docs/color-decision-template.md` and `docs/palette-source.json` below it.
Preserve the source license there; it does not replace your project’s license.
The full checkout is preferred: the minimal bundle does not carry all gallery
assets, research links or runnable package checks.

---

## 3. Persistent (global) — Axiom in every project forever

Use the per-agent patterns below. The global pattern keeps your project's root clean and makes Axiom a "layer" your agent can opt in or out of per project.

---

## Per-agent install

All copied/symlinked entry-point examples below require the companion bundle
from §2 at the target, or explicit paths to the retained checkout. For global
rules and pasted prompts, provide `COLOR-PRINCIPLES.md` and the decision template
as project knowledge too, or tell the agent their actual accessible paths. A
short instruction file alone must not bypass the color gate.

### Claude Code

Claude Code auto-loads `CLAUDE.md` from the project root. Two options:

**Project-scoped:** symlink this repo's `CLAUDE.md` into your project:

```bash
git clone https://github.com/Nonarkara/Axiom-Design-Core.git /tmp/axiom-dc
ln -s /tmp/axiom-dc/CLAUDE.md ./CLAUDE.md
ln -s /tmp/axiom-dc/AGENTS.md ./AGENTS.md
```

**Global:** add Axiom as a global agent instruction:

```bash
mkdir -p ~/.claude
cp /tmp/axiom-dc/AGENTS.md ~/.claude/axiom-design-core.md
# Then in your project, add to settings.json:
# { "globalInstructions": "~/.claude/axiom-design-core.md" }
```

### Cursor

Cursor reads `AGENTS.md` from the project root (modern) or `.cursorrules` (legacy).

**Project-scoped:**
```bash
cp /tmp/axiom-dc/AGENTS.md ./AGENTS.md
```

**Global (Settings → Rules for AI):** paste the contents of `AGENTS.md` into the Rules panel.

**Newer Rules format:** save to `.cursor/rules/axiom.mdc`:
```bash
mkdir -p .cursor/rules
cp /tmp/axiom-dc/AGENTS.md .cursor/rules/axiom.mdc
```

### Cline

Cline reads `AGENTS.md` from the project root. Also supports `.clinerules` for legacy:
```bash
cp /tmp/axiom-dc/AGENTS.md ./AGENTS.md
```

### Continue

Continue reads `AGENTS.md` from the project root, or you can paste into the system prompt in Settings:
```bash
cp /tmp/axiom-dc/AGENTS.md ./AGENTS.md
```

### Aider

Aider reads `AGENTS.md` (via conventions) or you can pass it as `--read`:
```bash
aider --read /tmp/axiom-dc/AGENTS.md --read /tmp/axiom-dc/AXIOM-DNA.md --read /tmp/axiom-dc/COLOR-PRINCIPLES.md
# Or persist:
cp /tmp/axiom-dc/AGENTS.md .aider.AGENTS.md
```

### Windsurf

Windsurf reads `.windsurfrules` from the project root, or `AGENTS.md` in newer versions:
```bash
cp /tmp/axiom-dc/AGENTS.md ./AGENTS.md
# Legacy:
cp /tmp/axiom-dc/AGENTS.md ./.windsurfrules
```

### GitHub Copilot / GPT-based agents

Paste `AGENTS.md` into the system prompt or the first message. Most web UIs (ChatGPT, Claude.ai) accept a "Custom Instructions" or "Project Knowledge" field — paste it there.

### Generic / custom agents

The agent reads `AGENTS.md` if it is at the project root, or you can include it in the system prompt:
```bash
# Embed in a system prompt:
cat /tmp/axiom-dc/AGENTS.md >> system-prompt.txt
```

---

## 4. Verify the install

After installing, ask your agent:

> "Without referencing any project, what is the Axiom Color Law?"

A correct install returns:
> "Is it DATA (live / critical / down) → bare red. Is it IDENTITY → enclosed blue. Is it DIRECTIONAL → greyscale triangle. None of these → no color, grey + size."

Also ask it to name the five color gates and locate the decision template and
source pin. It should return viewport, grayscale value, roles/area, exact
rendered contrast and non-color meaning; Palette shares are not universal
dashboard quotas. If it cannot locate `COLOR-PRINCIPLES.md`, the companion
installation is incomplete.

If the agent instead says "I should use color to liven it up," the install is broken — `AGENTS.md` is not being loaded.

---

## 5. Updating

```bash
cd /path/to/Axiom-Design-Core
git pull
```

If you copied the guidance into your project, update the full companion bundle
after review, including `COLOR-PRINCIPLES.md`, its template, source pin and
notices. Keep project-specific decision evidence intact. Palette upgrades are
intentional source reviews, not automatic pulls from its `main`.

If you symlinked, the symlink resolves on every load — no re-copy needed.

---

## 6. Unattributing

This repo quotes and applies Dieter Rams's principles and the 1970 NYCTA Graphics Standards Manual as commentary. It does not license them. See `LICENSE` and `NOTICE.md` (in the Rams × NYCTA variant) for details. The MIT License covers only original work in this repository.

---

*axiom.nonarkara.org · Non Arkaraprasertkul · Axiom X Co., Ltd. · MIT License.*
