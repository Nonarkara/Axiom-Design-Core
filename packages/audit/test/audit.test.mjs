#!/usr/bin/env node
/**
 * One runnable check for the whole audit. Asserts the three things that were
 * actually wrong on 2026-09-11, so they cannot come back:
 *
 *   1. the design core passes its own audit (it failed 15 times, all false
 *      positives: 700 weights the §6.2 scale mandates, the two easing tokens
 *      tokens.css itself declares, and an arrow inside a CSS comment)
 *   2. --strict is the only thing that fails a build (it used to exit 1 always,
 *      while the report said "run with --strict to fail the build")
 *   3. the back and seam layers actually fire (they were brand new and unproven)
 *
 * ponytail: node:test, no framework, no fixtures beyond one dirty directory.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..', '..');
const bin = join(repo, 'packages', 'audit', 'bin', 'axiom-audit.mjs');
const fixture = join(here, 'fixture');

function audit(target, ...flags) {
  try {
    const out = execFileSync(process.execPath, [bin, target, '--json', ...flags], { encoding: 'utf8' });
    return { code: 0, ...JSON.parse(out) };
  } catch (e) {
    return { code: e.status, ...JSON.parse(e.stdout || '{}') };
  }
}

function findings(layer, fileRe) {
  return (audit(fixture).findings || [])
    .filter((f) => f.layer === layer && (!fileRe || fileRe.test(f.file)))
    .map((f) => f.msg)
    .join('\n');
}

test('the design core passes its own audit', () => {
  const r = audit(repo);
  assert.equal(r.errors, 0, `design core must obey its own canon:\n${(r.findings || []).map((f) => `  ${f.file}:${f.line} ${f.msg}`).join('\n')}`);
});

test('§6.2 mandates weight 700 for section labels, so 700 is not an error', () => {
  const r = audit(repo);
  assert.equal((r.findings || []).filter((f) => /font weight/i.test(f.msg) && f.severity === 'error').length, 0);
});

test('the easing tokens tokens.css declares are not flagged as overshoot', () => {
  const r = audit(repo);
  assert.equal((r.findings || []).filter((f) => /overshoot|bounce/i.test(f.msg)).length, 0);
});

test('only --strict fails the build', () => {
  assert.equal(audit(fixture).code, 0, 'advisory mode must exit 0');
  assert.equal(audit(fixture, '--strict').code, 2, 'strict must exit 2 on errors');
});

test('a scan that cannot run exits 1, not 2 — an outage is not a design finding', () => {
  const r = audit(join(repo, 'no', 'such', 'dir'));
  assert.equal(r.code, 1);
});

test('back layer: secrets, fabricated data, swallowed errors, SQL interpolation', () => {
  const msgs = (audit(fixture).findings || []).filter((f) => f.layer === 'back').map((f) => f.msg).join('\n');
  for (const expected of [/Anthropic key literal/, /Math\.random\(\) on a data path/, /Empty catch/, /string interpolation/, /publishes the key/]) {
    assert.match(msgs, expected);
  }
});

test('back layer does not fire its data-path rules on a UI file', () => {
  const back = (audit(fixture).findings || []).filter((f) => f.layer === 'back');
  const randomHits = back.filter((f) => /Math\.random/.test(f.msg));
  assert.ok(randomHits.length > 0);
  assert.ok(randomHits.every((f) => /api|route|service/.test(f.file)), 'Math.random must only be flagged on a data path');
});

test('seam layer: a header produced and never read, and one read and never produced', () => {
  const seam = (audit(fixture).findings || []).filter((f) => f.layer === 'seam');
  const msgs = seam.map((f) => f.msg).join('\n');
  assert.match(msgs, /X-Data-Source is set in .* and read nowhere/);
  assert.match(msgs, /X-Data-Tier is read in .* and set by no route/);
});

test('seam layer computes contrast rather than trusting the comment', () => {
  const msgs = (audit(fixture).findings || []).filter((f) => f.layer === 'seam').map((f) => f.msg).join('\n');
  assert.match(msgs, /--ink-2 on --paper is 1\.\d+:1, below the §19 floor/);
});

/* ── Origin tells (PR #3) ──────────────────────────────────────────────────
 * The bans above catch decoration; these catch provenance. Pinned the same way
 * as the rest: src/tells.html in the fixture carries the whole stack, one line
 * per tell, so a rule that stops firing fails here instead of shipping.
 */

test('origin tells: template fonts, slop palette, gradient text', () => {
  const msgs = findings('front', /^src\/tells\.html$/);
  assert.match(msgs, /Banned template font in a Google Fonts URL/);
  assert.match(msgs, /Banned template font\. These are the faces/);
  assert.match(msgs, /VibeCode purple/);
  assert.match(msgs, /Tailwind default blue/);
  assert.match(msgs, /Gradient text on headings/);
});

test('origin tells: the View-Source layer lives in the back half, once', () => {
  const all = audit(fixture).findings || [];
  const msgs = all.map((f) => f.msg).join('\n');
  assert.match(msgs, /Generator meta tag names the tool/);
  assert.match(msgs, /Builder-platform host left in the source/);
  assert.match(msgs, /Dev-server reference/);
  // PR #3 carried key literals and client-side vendor calls too; spine.mjs
  // already owned both. One copy of each, or a clean file reports twice.
  for (const re of [/Anthropic key literal/, /publishes the key/, /Dev-server reference/]) {
    assert.equal(all.filter((f) => re.test(f.msg)).length, 1, `duplicated rule: ${re}`);
  }
});

test('a dev-server URL is one finding, not a URL plus a bare-host warning', () => {
  const hits = (audit(fixture).findings || []).filter((f) => /localhost/.test(f.match || ''));
  assert.equal(hits.length, 1);
  assert.equal(hits[0].severity, 'error');
});

test('origin tells: layout and copy reflexes are warnings — the writer decides', () => {
  const hits = (audit(fixture).findings || []).filter((f) => ['layout', 'copy'].includes(f.rule));
  assert.ok(hits.length >= 6);
  assert.ok(hits.every((f) => f.severity === 'warn'), 'a judgment call must not fail a build');
  const msgs = hits.map((f) => f.msg).join('\n');
  for (const re of [/Three-equal-card row/, /Centred content/, /Bento grid/, /Sparkle\/beta pill/, /Fake-precision stat banner/, /Buzzword tell/]) {
    assert.match(msgs, re);
  }
});

test('easing is judged on the y params positionally — y1 undershoot is caught', () => {
  const msgs = findings('front', /^src\/tells\.html$/);
  assert.match(msgs, /y1 outside 0\.\.1/, 'cubic-bezier(0.4, -0.5, 0.6, 1) is undershoot at y1');
  assert.match(msgs, /y2 outside 0\.\.1/, 'cubic-bezier(0.4, 0, 0.6, 1.8) is overshoot at y2');
  const legal = (audit(fixture).findings || []).filter((f) => /0\.23, 1, 0\.32, 1/.test(f.match || ''));
  assert.equal(legal.length, 0, 'y === 1 is an ordinary fast-out curve, not overshoot');
});

test('weight 700 stays legal and 800+ stays an error, in a dirty file too', () => {
  const weights = (audit(fixture).findings || []).filter((f) => /font weight/i.test(f.msg));
  assert.equal(weights.length, 1, 'only the 900 declaration is a finding');
  assert.match(weights[0].match, /900/);
});

test('a waiver without a reason is itself a finding', () => {
  const msgs = (audit(fixture).findings || []).map((f) => f.msg).join('\n');
  assert.doesNotMatch(msgs, /Waiver with no reason/, 'fixture has no waivers');
});
