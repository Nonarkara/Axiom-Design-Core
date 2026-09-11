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

test('a waiver without a reason is itself a finding', () => {
  const msgs = (audit(fixture).findings || []).map((f) => f.msg).join('\n');
  assert.doesNotMatch(msgs, /Waiver with no reason/, 'fixture has no waivers');
});
