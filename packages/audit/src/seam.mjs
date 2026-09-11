/**
 * SEAM — the checks that need the whole project, not one line.
 *
 * bans.mjs and spine.mjs are per-line regex: cheap, and blind to anything that
 * spans two files. The defects that actually survive review live exactly there:
 *
 *   - a token whose value contradicts the law that publishes it
 *   - a provenance header a server sets and no client ever reads
 *   - a hex literal in source that is not any token
 *
 * Mechanisms borrowed, with thanks:
 *   contrast maths      <- nextlevelbuilder/ui-ux-pro-max-skill (validate_data.py)
 *   token-drift + tol.  <- pbakaus/impeccable (crates/detect/src/design_system.rs)
 *   countable ratio     <- leonxlnx/taste-skill (eyebrow count > ceil(sections/3))
 *
 * The provenance seam is ours: none of the surveyed systems check it, because
 * all of them are frontend-only.
 */

import { readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { collectFiles } from './scanner.mjs';

/* ── WCAG ────────────────────────────────────────────────────────────────── */

/** sRGB relative luminance. */
function luminance(hex) {
  const ch = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** §19 floors. Body text 4.5:1; large text and UI elements 3:1. */
const FLOOR = { text: 4.5, ui: 3 };

/**
 * Token roles that carry text, with the floor each must clear. §6.2 assigns
 * --ink-3 to the 9px micro-label role, so it carries text and must clear a
 * floor — it is not decorative.
 */
const CONTRAST_CONTRACT = [
  { fg: 'ink', bg: 'paper', floor: FLOOR.text, role: 'primary text (§6.2 body/value)' },
  { fg: 'ink-2', bg: 'paper', floor: FLOOR.text, role: 'secondary text — tokens.css declares "AA on --paper"' },
  { fg: 'ink-3', bg: 'paper', floor: FLOOR.ui, role: 'micro-label / meta, 9px UPPERCASE (§6.2)' },
  { fg: 'blue', bg: 'paper', floor: FLOOR.text, role: 'identity text' },
  { fg: 'red', bg: 'paper', floor: FLOOR.text, role: 'the Move, bare (§19 says verify at small sizes)' },
];

const WHITE_ON = [
  { bg: 'blue', role: 'white glyphs on --blue (§19 claims it passes)' },
  { bg: 'red', role: 'white glyphs on --red (§19 claims it passes)' },
];

export function parseTokens(css) {
  const out = {};
  for (const m of css.matchAll(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})\b/g)) out[m[1]] = m[2].toLowerCase();
  return out;
}

export function checkContrast(tokens) {
  const findings = [];
  const have = (k) => Object.prototype.hasOwnProperty.call(tokens, k);

  for (const { fg, bg, floor, role } of CONTRAST_CONTRACT) {
    if (!have(fg) || !have(bg)) continue;
    const r = contrastRatio(tokens[fg], tokens[bg]);
    if (r < floor) {
      findings.push({
        rule: 'contrast-floor',
        severity: 'error',
        msg: `--${fg} on --${bg} is ${r.toFixed(2)}:1, below the §19 floor of ${floor}:1 — ${role}.`,
      });
    }
  }
  for (const { bg, role } of WHITE_ON) {
    if (!have(bg)) continue;
    const r = contrastRatio('#ffffff', tokens[bg]);
    if (r < FLOOR.text) {
      findings.push({ rule: 'contrast-floor', severity: 'error', msg: `white on --${bg} is ${r.toFixed(2)}:1, below ${FLOOR.text}:1 — ${role}.` });
    }
  }
  return findings;
}

/* ── the provenance seam ─────────────────────────────────────────────────── */

const SERVERISH = /(?:^|\/)(?:api|routes?|server|services?|handlers?|functions?|workers?|pages\/api)(?:\/|$)|\.(?:route|service|handler)\.[jt]sx?$/i;
const PRODUCE = /['"`](X-Data-[A-Za-z-]+|X-Source|X-Provenance|X-Cache-Status)['"`]\s*:/g;
const CONSUME = /headers\s*\.\s*get\s*\(\s*['"`](X-[A-Za-z-]+)['"`]\s*\)/g;

/**
 * §20 bans "Data without provenance". A header a route sets and no client reads
 * satisfies the letter of that ban and none of its intent: the signal exists,
 * the reader never sees it, and the next person to open the file assumes it
 * works. The reverse — a client reading a header nothing sets — is worse: it
 * silently takes the default forever.
 */
export function checkProvenanceSeam(files) {
  const produced = new Map(); // header -> [files]
  const consumed = new Map();

  for (const { rel, text } of files) {
    const bucket = SERVERISH.test(rel) ? produced : consumed;
    for (const m of text.matchAll(PRODUCE)) {
      const h = m[1];
      if (!produced.has(h)) produced.set(h, []);
      produced.get(h).push(rel);
    }
    for (const m of text.matchAll(CONSUME)) {
      const h = m[1];
      if (!consumed.has(h)) consumed.set(h, []);
      consumed.get(h).push(rel);
    }
    void bucket;
  }

  const findings = [];
  for (const [h, where] of produced) {
    if (!consumed.has(h)) {
      findings.push({
        rule: 'seam-orphan-producer',
        severity: 'error',
        msg: `${h} is set in ${where.length} place(s) and read nowhere. Wire it into the UI or delete it — a signal produced and never consumed is worse than no signal, because the next reader assumes it works. First: ${where[0]}`,
      });
    }
  }
  for (const [h, where] of consumed) {
    if (!produced.has(h)) {
      findings.push({
        rule: 'seam-orphan-consumer',
        severity: 'warn',
        msg: `${h} is read in ${where[0]} and set by no route in this project. It will silently take its default forever. (Fine if the producer is a separate service — waive it with a reason.)`,
      });
    }
  }
  return findings;
}

/* ── token drift ─────────────────────────────────────────────────────────── */

/** Channel tolerance, borrowed from impeccable: a 1-2 step rounding is not drift. */
const CHANNEL_TOLERANCE = 6;

function channels(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

function nearAnyToken(hex, tokenHexes) {
  const c = channels(hex);
  return tokenHexes.some((t) => channels(t).every((v, i) => Math.abs(v - c[i]) <= CHANNEL_TOLERANCE));
}

export function checkTokenDrift(files, tokens) {
  const tokenHexes = Object.values(tokens);
  const findings = [];
  const seen = new Set();
  for (const { rel, text } of files) {
    if (rel.startsWith('packages' + sep) || rel === 'tokens.css') continue;
    for (const m of text.matchAll(/(?<![\w-])#([0-9a-fA-F]{6})(?![0-9a-fA-F])/g)) {
      const hex = ('#' + m[1]).toLowerCase();
      const key = rel + hex;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!nearAnyToken(hex, tokenHexes)) {
        findings.push({ rule: 'token-drift', severity: 'warn', msg: `${rel}: ${hex} is not within ${CHANNEL_TOLERANCE}/255 of any token in tokens.css. Add it as a token or use an existing one.` });
      }
    }
  }
  return findings;
}

/* ── countable pre-flight ────────────────────────────────────────────────── */

/**
 * taste-skill's mechanical eyebrow rule, ported. §14.1.6 already bans the
 * "tiny-uppercase-tracked eyebrow above every section" as reflexive
 * scaffolding; a count makes that enforceable instead of arguable.
 */
export function checkEyebrowRatio(files) {
  const findings = [];
  for (const { rel, text } of files) {
    if (!/\.(html|tsx|jsx|vue|svelte)$/.test(rel)) continue;
    const sections = (text.match(/<section\b|<Section\b/g) || []).length;
    if (sections < 3) continue;
    const eyebrows = (text.match(/\b(?:eyebrow|kicker|overline|section-label)\b/gi) || []).length;
    const ceiling = Math.ceil(sections / 3);
    if (eyebrows > ceiling) {
      findings.push({ rule: 'eyebrow-ratio', severity: 'warn', msg: `${rel}: ${eyebrows} eyebrow/kicker labels across ${sections} sections (ceiling ${ceiling} = ceil(sections/3)). An eyebrow on every section is scaffolding, not information (§14.1.6).` });
    }
  }
  return findings;
}

/* ── runner ──────────────────────────────────────────────────────────────── */

export async function runSeam(root) {
  const paths = await collectFiles(root);
  const files = [];
  for (const p of paths) {
    try {
      files.push({ rel: relative(root, p).split(sep).join('/'), text: await readFile(p, 'utf8') });
    } catch { /* unreadable file is not a design finding */ }
  }

  let tokens = {};
  try {
    tokens = parseTokens(await readFile(join(root, 'tokens.css'), 'utf8'));
  } catch { /* no tokens.css — contrast and drift are not checkable here */ }

  const findings = [
    ...(Object.keys(tokens).length ? checkContrast(tokens) : []),
    ...checkProvenanceSeam(files),
    ...(Object.keys(tokens).length ? checkTokenDrift(files, tokens) : []),
    ...checkEyebrowRatio(files),
  ];
  return { findings, tokenCount: Object.keys(tokens).length, fileCount: files.length };
}
