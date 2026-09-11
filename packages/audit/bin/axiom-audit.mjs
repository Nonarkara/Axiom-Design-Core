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
 * Exit codes (shape borrowed from pbakaus/impeccable — an operational failure
 * and a design finding are different events and must not share a code):
 *   0  scan completed; clean, or findings in advisory mode
 *   1  the scan itself could not run (bad path, nothing scannable)
 *   2  scan completed and found errors, with --strict
 *   3  invalid usage
 *
 * Advisory by default on purpose: a codebase adopting this mid-life has
 * hundreds of findings, and a checker that blocks on day one gets deleted on
 * day two. Turn on --strict in CI once the count is down.
 */

import { resolve } from 'node:path';
import { runAudit } from '../src/scanner.mjs';
import { formatReport, formatJson } from '../src/report.mjs';

function parseArgs(argv) {
  const args = { path: '.', strict: false, json: false, help: false, seam: true };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--strict') args.strict = true;
    else if (a === '--no-seam') args.seam = false;
    else if (a === '--json') args.json = true;
    else if (a === '-h' || a === '--help') args.help = true;
    else if (a.startsWith('--')) {
      console.error(`Unknown flag: ${a}`);
      process.exit(3);
    } else args.path = a;
  }
  return args;
}

function printHelp() {
  console.log(`axiom-audit — scan a project for Axiom / Rams × NYCTA hard bans.

Usage:
  axiom-audit [path] [--strict] [--json]

Options:
  --strict   Exit 2 when errors are found (use in CI).
             Without it the audit reports and exits 0 — advisory mode.
  --no-seam  Skip the cross-file layer (contrast, provenance seam, token drift).
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

  const result = await runAudit(root, { seam: args.seam });
  if (result.files === 0) {
    console.error(`axiom-audit: nothing scannable under ${root}`);
    process.exit(1);
  }
  result.root = root;
  result.strict = args.strict;

  if (args.json) {
    console.log(formatJson(result));
  } else {
    console.log(formatReport(result));
  }

  // Only --strict fails the build. Before this, every run exited 1 on any
  // error while the report said "Run with --strict to fail the build" — so the
  // flag was decorative and advisory mode did not exist.
  if (args.strict && result.errors > 0) process.exit(2);
}

main().catch((err) => {
  console.error('axiom-audit failed:', err);
  process.exit(2);
});
