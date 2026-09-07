/**
 * Format an audit result for the terminal.
 *
 * - report:  human-readable plain text
 * - json:    machine-readable summary
 */

const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function useColor() {
  return process.stdout.isTTY && !process.env.NO_COLOR;
}

export function formatReport({ files, findings, errors, warnings, root, strict }, { color = useColor() } = {}) {
  const c = (code, s) => (color ? `${code}${s}${RESET}` : s);
  const lines = [];
  lines.push(c(BOLD, 'axiom-audit') + c(DIM, `  scanning ${root}`));
  lines.push(c(DIM, `${files} files scanned · ${errors} errors · ${warnings} warnings`));
  lines.push('');

  if (findings.length === 0) {
    lines.push(c(BOLD, '✓ Clean.'));
    lines.push(c(DIM, '  No hard-bans detected. Function first, subtract, one Divine Move.'));
    return lines.join('\n');
  }

  // Group by file
  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }

  for (const [file, list] of byFile) {
    lines.push(c(BOLD, file));
    for (const f of list) {
      const sev = f.severity === 'error' ? c(RED, '✗') : c(YELLOW, '!');
      const pos = c(DIM, `${String(f.line).padStart(4)}:${String(f.col).padStart(3)}`);
      const match = c(DIM, `\`${f.match}\``);
      lines.push(`  ${sev}  ${pos}  ${f.msg}  ${match}`);
    }
    lines.push('');
  }

  if (strict) {
    lines.push(c(RED, `${errors} error(s) found. Strict mode — build fails.`));
  } else {
    lines.push(c(YELLOW, `${errors} error(s), ${warnings} warning(s) found. Run with --strict to fail the build.`));
  }
  return lines.join('\n');
}

export function formatJson(result) {
  return JSON.stringify(result, null, 2);
}
