import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkContrast, contrastRatio, parseTokens, CONTRAST_CONTRACT } from '../src/seam.mjs';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const read = (path) => readFileSync(resolve(repo, path), 'utf8');
const css = read('tokens.css');
const tokens = parseTokens(css);
const principles = read('COLOR-PRINCIPLES.md');
const source = JSON.parse(read('docs/palette-source.json'));

// These numerical fixtures exercise the existing WCAG implementation, rather
// than merely searching prose for the word "contrast".
test('sRGB contrast has known endpoints and is symmetric', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
  assert.equal(contrastRatio('#737069', '#737069'), 1);
  assert.equal(contrastRatio(tokens.paper, tokens.red), contrastRatio(tokens.red, tokens.paper));
});

test('Axiom identity values stay stable; the small-text neutral clears 4.5:1', () => {
  assert.deepEqual(Object.fromEntries(['paper', 'panel', 'ink', 'blue', 'red'].map((key) => [key, tokens[key]])), {
    paper: '#f6f5f2', panel: '#ffffff', ink: '#191712', blue: '#26243f', red: '#a8322b',
  });
  assert.equal(tokens['ink-3'], '#737069');
  assert.deepEqual(checkContrast(tokens), []);
  assert.ok(CONTRAST_CONTRACT.length >= 16);
});

test('a 9px label is text, not a 3:1 UI exemption', () => {
  const former = checkContrast({ ...tokens, 'ink-3': '#918e84' });
  const failures = former.filter((f) => /--ink-3/.test(f.msg));
  assert.equal(failures.length, 2, 'both paper and panel must reject the former micro-label color');
  assert.ok(failures.every((f) => /floor of 4.5:1/.test(f.msg)));
});

test('paper and panel are checked independently', () => {
  const failures = checkContrast({ ...tokens, panel: tokens.ink });
  assert.ok(failures.some((f) => /--ink on --panel/.test(f.msg)));
});

test('actual warm-paper glyphs are measured, not hypothetical white', () => {
  const example = '#00853f';
  assert.ok(contrastRatio('#ffffff', example) >= 4.5);
  assert.ok(contrastRatio(tokens.paper, example) < 4.5);
  const failures = checkContrast({ ...tokens, blue: example });
  assert.ok(failures.some((f) => /--paper on --blue/.test(f.msg)));
  assert.match(css, /\.disc\s*\{[^}]*color:\s*var\(--paper\)/);
  assert.match(read('packages/react/src/styles.css'), /\.ax-disc\s*\{[^}]*color:\s*var\(--paper\)/);
});

test('the documented worked examples reflect exact current tokens', () => {
  const rows = [...principles.matchAll(/\| `--([\w-]+)` \| `--([\w-]+)` \| ([\d.]+):1 \|/g)];
  assert.equal(rows.length, 8, 'retain the measured example table');
  for (const [, fg, bg, displayed] of rows) {
    assert.ok(tokens[fg] && tokens[bg], `unknown token in ${fg}/${bg}`);
    const actual = contrastRatio(tokens[fg], tokens[bg]);
    assert.ok(actual >= 4.5, `${fg}/${bg} must meet the unrounded small-text floor`);
    assert.equal(actual.toFixed(2), displayed, `${fg}/${bg} documentation drifted`);
  }
});

test('the TypeScript core token exports match CSS, including ink3', () => {
  const ts = read('packages/react/src/tokens.ts');
  const mapping = { paper: 'paper', panel: 'panel', ink: 'ink', ink2: 'ink-2', ink3: 'ink-3', line: 'line', line2: 'line-2', blue: 'blue', red: 'red' };
  for (const [key, token] of Object.entries(mapping)) {
    const match = ts.match(new RegExp(`^\\s*${key}: '(#[0-9a-f]{6})'`, 'im'));
    assert.ok(match, `missing typed ${key}`);
    assert.equal(match[1].toLowerCase(), tokens[token], `${key} drifted from --${token}`);
  }
});

test('trunk choices preserve family colors and reject unsafe small-glyph pairs', () => {
  const expected = { blue: '#0039a6', orange: '#ff6319', green: '#00853f', red: '#ee352e', purple: '#b933ad', yellow: '#fccc0a', grey: '#6d6e71', brown: '#996633' };
  for (const [color, hex] of Object.entries(expected)) assert.equal(tokens[`rt-${color}`], hex);
  for (const color of ['orange', 'yellow']) assert.ok(contrastRatio(tokens.ink, tokens[`rt-${color}`]) >= 4.5);
  for (const color of ['blue', 'green', 'purple', 'grey', 'brown']) assert.ok(contrastRatio(tokens.panel, tokens[`rt-${color}`]) >= 4.5);
  for (const fg of ['ink', 'panel']) assert.ok(contrastRatio(tokens[fg], tokens['rt-red']) < 4.5);
  assert.ok(contrastRatio(tokens.panel, tokens['rt-red']) >= 3, 'large text only');
  for (const color of ['green', 'brown']) assert.ok(contrastRatio(tokens.paper, tokens[`rt-${color}`]) < 4.5);
});

test('Palette source is explicitly pinned and its local deliverables exist', () => {
  assert.equal(source.format, 'axiom-palette-source/1');
  assert.equal(source.repository, 'https://github.com/Nonarkara/palette');
  assert.match(source.commit, /^[0-9a-f]{40}$/);
  assert.equal(source.vendorsColorData, false);
  for (const key of ['adaptation', 'decisionTemplate', 'notice']) assert.ok(existsSync(resolve(repo, source[key])), `${key} is missing`);
  for (const file of [source.adaptation, source.notice, source.decisionTemplate]) assert.ok(read(file).includes(source.commit), `${file} must match the reviewed pin`);
  for (const path of ['PALETTE-FIELD-GUIDE.md', 'ABOUT.md', 'context.md', 'app.js']) {
    assert.ok(source.sourceFiles.includes(path));
    assert.ok(principles.includes(`${source.repository}/blob/${source.commit}/${path}`));
  }
  assert.ok(source.sourceFiles.includes('LICENSE'));
  assert.ok(source.sourceFiles.includes('THIRD_PARTY_NOTICES.md'));
  assert.doesNotMatch(principles, /github\.com\/Nonarkara\/palette\/blob\/main\//);
});

test('the authoritative color method travels through every adoption entry point', () => {
  for (const path of ['AGENTS.md', 'CLAUDE.md', 'AXIOM-DNA.md', 'README.md', 'USAGE.md', 'WIRE-IN.md', 'BUILDER.md', 'ANTI-TEMPLATE.md', 'quick-start.html', 'components.html', 'tokens.css', 'packages/audit/README.md', 'packages/react/README.md', 'packages/tailwind-preset/README.md']) {
    assert.ok(read(path).includes('COLOR-PRINCIPLES.md'), `${path} must route to the canonical method`);
  }
  const usage = read('USAGE.md');
  for (const companion of ['COLOR-PRINCIPLES.md', 'color-decision-template.md', 'palette-source.json', 'THIRD_PARTY_NOTICES.md']) assert.ok(usage.includes(companion));
  assert.match(read('AXIOM-DNA.md').split('## TABLE OF CONTENTS')[0], /COLOR METHOD:/, 'the copyable system prompt must retain the gate');
  assert.match(read('.github/workflows/axiom.yml'), /node --test packages\/audit\/test\/\*\.test\.mjs/);
});

test('local links in the color authority, notice and template resolve', () => {
  for (const file of [source.adaptation, source.notice, source.decisionTemplate]) {
    for (const [, target] of read(file).matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:https?:|#)/.test(target)) continue;
      const path = target.split('#')[0];
      assert.ok(existsSync(resolve(repo, dirname(file), path)), `${file}: broken ${target}`);
    }
  }
});

// Static, 8-bit sRGB composites for the two known opacity hover styles. These
// fixtures do not pretend to replace browser inspection of arbitrary backdrops.
function compositeHex(foreground, background, opacity) {
  return '#' + [1, 3, 5].map((i) => Math.round(
    parseInt(foreground.slice(i, i + 2), 16) * opacity
    + parseInt(background.slice(i, i + 2), 16) * (1 - opacity),
  ).toString(16).padStart(2, '0')).join('');
}

test('the existing opacity hover fixtures pass only on their tested backdrops', () => {
  for (const [variant, background] of [['primary', 'ink'], ['critical', 'red']]) {
    const rule = css.match(new RegExp(`\\.btn--${variant}:hover\\s*\\{\\s*opacity:\\s*([.\\d]+);`));
    assert.ok(rule, `review ${variant} hover when its style changes`);
    const opacity = Number(rule[1]);
    for (const backdrop of ['paper', 'panel']) {
      const fg = compositeHex(tokens.paper, tokens[backdrop], opacity);
      const bg = compositeHex(tokens[background], tokens[backdrop], opacity);
      assert.ok(contrastRatio(fg, bg) >= 4.5, `${variant} hover on ${backdrop}`);
    }
  }
  const dimmedLabel = compositeHex(tokens['ink-3'], tokens.paper, 0.88);
  assert.ok(contrastRatio(dimmedLabel, tokens.paper) < 4.5, 'dimming a passing label is not automatically safe');
});
