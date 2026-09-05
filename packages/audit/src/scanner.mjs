import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { BANS, SCAN_EXTENSIONS, SKIP_PATTERNS, UI_EXTENSIONS, UI_ONLY_RULES } from './bans.mjs';

const IGNORE_LINE = /^\s*\/\/\s*axiom-audit-ignore(?:-next-line)?/;

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
  lines.forEach((line, i) => {
    if (ignoreNext) {
      ignoreNext = false;
      return;
    }
    if (IGNORE_LINE.test(line)) {
      if (/axiom-audit-ignore-next-line/.test(line)) ignoreNext = true;
      return;
    }

    for (const [category, rules] of Object.entries(BANS)) {
      // Skip UI-only rules when the file is not a UI file
      if (UI_ONLY_RULES.has(category) && !uiFile) continue;

      for (const rule of rules) {
        rule.re.lastIndex = 0;
        let m;
        while ((m = rule.re.exec(line)) !== null) {
          out.push({
            file: rel.split(sep).join('/'),
            line: i + 1,
            col: m.index + 1,
            match: m[0],
            msg: rule.msg,
            severity: rule.severity ?? 'error',
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
export async function runAudit(root) {
  const files = await collectFiles(root);
  const findings = [];
  for (const f of files) {
    const r = await scanFile(f, root);
    findings.push(...r);
  }
  return {
    files: files.length,
    findings,
    errors: findings.filter((f) => f.severity === 'error').length,
    warnings: findings.filter((f) => f.severity === 'warn').length,
  };
}
