#!/usr/bin/env node
/**
 * axiom-audit — scan any project for Axiom / Rams × NYCTA hard bans.
 *
 * Usage:
 *   axiom-audit [path] [--strict] [--json]
 *
 * Examples:
 *   axiom-audit .
 *   axiom-audit ./apps/web
 *   axiom-audit . --strict --json
 *
 * Exit codes:
 *   0  clean (or warnings only in non-strict mode)
 *   1  errors found
 *   2  invalid usage
 */

import { resolve } from 'node:path';
import { runAudit } from '../src/scanner.mjs';
import { formatReport, formatJson } from '../src/report.mjs';

function parseArgs(argv) {
  const args = { path: '.', strict: false, json: false, help: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--strict') args.strict = true;
    else if (a === '--json') args.json = true;
    else if (a === '-h' || a === '--help') args.help = true;
    else if (a.startsWith('--')) {
      console.error(`Unknown flag: ${a}`);
      process.exit(2);
    } else args.path = a;
  }
  return args;
}

function printHelp() {
  console.log(`axiom-audit — scan a project for Axiom / Rams × NYCTA hard bans.

Usage:
  axiom-audit [path] [--strict] [--json]

Options:
  --strict   Exit non-zero on errors (use in CI).
  --json     Output machine-readable JSON.
  -h, --help Show this help.

Examples:
  axiom-audit .
  axiom-audit ./apps/web --strict
  axiom-audit . --json | jq '.errors'
`);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }
  const root = resolve(process.cwd(), args.path);

  const result = await runAudit(root);
  result.root = root;
  result.strict = args.strict;

  if (args.json) {
    console.log(formatJson(result));
  } else {
    console.log(formatReport(result));
  }

  if (result.errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error('axiom-audit failed:', err);
  process.exit(2);
});
