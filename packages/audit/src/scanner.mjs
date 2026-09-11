import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { BANS, SCAN_EXTENSIONS, SKIP_PATTERNS, UI_EXTENSIONS, UI_ONLY_RULES } from './bans.mjs';
import { SPINE_BANS } from './spine.mjs';

/**
 * A waiver must say why. Borrowed from impeccable, whose suppression requires a
 * mandatory `--reason`: an exception list you can read is governance, an
 * exception list you can only feel is drift. A directive with no reason is
 * itself reported, so `grep -rn axiom-audit-ignore` is the reviewable
 * exception register for the whole project.
 *
 *   // axiom-audit-ignore -- palette page prints its own token values
 *   <!-- axiom-audit-ignore-next-line colors -- ban list names the ban -->
 */
const IGNORE_LINE = /axiom-audit-ignore(-next-line)?(?:\s+([a-z-]+))?\s*(?:--\s*(.*?)\s*(?:\*\/|-->)?\s*$)?/;
const HAS_DIRECTIVE = /axiom-audit-ignore/;

/**
 * Strip comment text before matching. A banned pattern named inside a comment
 * is documentation, not a violation — quick-start.html was flagged for the "←"
 * in `/* ← Change to --red ... *\/`, and bans.mjs claimed comments were already
 * skipped when nothing skipped them.
 *
 * Multi-line block comments are tracked across lines too — tokens.css opens a
 * banner comment containing the sentence "Pure #000 and pure #fff are banned",
 * and a ban list must not flag the document that states the ban.
 */
export function stripComments(line) {
  return line
    .replace(/\/\*[\s\S]*?\*\//g, ' ')        // /* ... */ closed on this line
    .replace(/<!--[\s\S]*?-->/g, ' ')           // <!-- ... --> closed on this line
    .replace(/(^|[^:])\/\/.*$/, '$1 ')          // // to EOL, but not the // in https://
    .replace(/\/\*.*$/, ' ')                    // unterminated /* opener
    .replace(/<!--.*$/, ' ');                    // unterminated <!-- opener
}

/**
 * Recursively collect files under a path, honoring skip patterns.
 *
 * @param {string} root
 * @returns {Promise<string[]>}
 */
export async function collectFiles(root) {
  const out = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const p = join(dir, e.name);
      const rel = relative(root, p);
      if (SKIP_PATTERNS.some((re) => re.test(rel))) continue;
      if (e.isDirectory()) {
        await walk(p);
      } else if (e.isFile()) {
        if (SCAN_EXTENSIONS.some((ext) => p.endsWith(ext))) {
          out.push(p);
        }
      }
    }
  }
  try {
    const s = await stat(root);
    if (s.isFile()) {
      if (SCAN_EXTENSIONS.some((ext) => root.endsWith(ext))) return [root];
      return [];
    }
  } catch {
    return [];
  }
  await walk(root);
  return out;
}

function isUiFile(filePath) {
  return UI_EXTENSIONS.some((ext) => filePath.endsWith(ext));
}

/**
 * Scan a single file for banned patterns.
 *
 * @param {string} filePath — absolute path
 * @param {string} root — root for relative path in output
 * @returns {Promise<Array<{file: string, line: number, col: number, match: string, msg: string, severity: 'error'|'warn'}>>}
 */
export async function scanFile(filePath, root) {
  const rel = relative(root, filePath);
  const text = await readFile(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const out = [];
  const uiFile = isUiFile(filePath);

  // Per-line audit, skipping lines that opt out via axiom-audit-ignore
  let ignoreNext = false;
  let inBlock = false; // inside an unterminated /* ... */ or <!-- ... -->
  lines.forEach((line, i) => {
    // Resolve multi-line comment state before anything else looks at the line.
    let visible = line;
    if (inBlock) {
      const close = visible.search(/\*\/|-->/);
      if (close === -1) return;                 // whole line is comment
      visible = ' '.repeat(close + 2) + visible.slice(close + 2);
      inBlock = false;
    }
    const opener = /\/\*(?![\s\S]*?\*\/)|<!--(?![\s\S]*?-->)/.exec(visible);
    if (opener) {
      inBlock = true;
      visible = visible.slice(0, opener.index);
    }

    if (ignoreNext) {
      ignoreNext = false;
      return;
    }
    if (HAS_DIRECTIVE.test(line)) {
      const m = IGNORE_LINE.exec(line);
      const reason = (m && m[3]) || '';
      if (!reason) {
        out.push({
          file: rel.split(sep).join('/'), line: i + 1, col: 1,
          match: 'axiom-audit-ignore',
          msg: 'Waiver with no reason. Write `-- why` after the directive so the exception register is reviewable.',
          severity: 'error', layer: 'front', rule: 'waiver',
        });
      }
      if (m && m[1]) ignoreNext = true;
      return;
    }

    const code = stripComments(visible);
    if (!code.trim()) return;

    const ruleSets = [
      ['front', BANS],
      ['back', SPINE_BANS],
    ];

    for (const [layer, set] of ruleSets)
    for (const [category, rules] of Object.entries(set)) {
      // Skip UI-only rules when the file is not a UI file
      if (layer === 'front' && UI_ONLY_RULES.has(category) && !uiFile) continue;

      for (const rule of rules) {
        // A back-half rule may scope itself to server/data or client paths.
        if (rule.paths && !rule.paths.test(rel.split(sep).join('/'))) continue;
        rule.re.lastIndex = 0;
        let m;
        while ((m = rule.re.exec(code)) !== null) {
          out.push({
            file: rel.split(sep).join('/'),
            line: i + 1,
            col: m.index + 1,
            match: m[0],
            msg: rule.msg,
            severity: rule.severity ?? 'error',
            layer,
            rule: category,
          });
        }
      }
    }
  });

  return out;
}

/**
 * Run a full audit.
 *
 * @param {string} root
 * @returns {Promise<{files: number, findings: Array, errors: number, warnings: number}>}
 */
export async function runAudit(root, { seam = true } = {}) {
  const files = await collectFiles(root);
  const findings = [];
  for (const f of files) {
    const r = await scanFile(f, root);
    findings.push(...r);
  }

  // The seam layer needs the whole project, not one line at a time: a token
  // that contradicts its own law, a provenance header produced and never read.
  if (seam) {
    const { runSeam } = await import('./seam.mjs');
    const s = await runSeam(root);
    for (const f of s.findings) findings.push({ file: f.file ?? '(project)', line: 0, col: 0, match: '', ...f, layer: 'seam' });
  }

  return {
    files: files.length,
    findings,
    errors: findings.filter((f) => f.severity === 'error').length,
    warnings: findings.filter((f) => f.severity === 'warn').length,
    byLayer: {
      front: findings.filter((f) => f.layer === 'front').length,
      back: findings.filter((f) => f.layer === 'back').length,
      seam: findings.filter((f) => f.layer === 'seam').length,
    },
  };
}
