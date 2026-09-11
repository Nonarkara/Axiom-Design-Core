/**
 * SPINE — the back half of the audit.
 *
 * AXIOM-DNA §20 already bans "Data without provenance". Until now nothing in
 * this repository produced provenance or checked that anything did: the design
 * core was frontend-only, so the one hard ban that depends on a server had no
 * enforcement behind it. These are the server-side and data-path bans that make
 * that ban real, plus the secret-hygiene and trust-boundary rules from the
 * Production Doctrine's five laws.
 *
 * Same shape as bans.mjs so the scanner needs no new engine — with one
 * addition: a rule may carry `paths`, a regex tested against the file's path,
 * so a data-path rule does not fire on a test fixture or a UI component.
 */

/** Paths that behave like a server, an API route, or a data adapter. */
const DATA_PATH = /(?:^|\/)(?:api|routes?|server|services?|handlers?|adapters?|lib|ingest(?:ion)?|jobs?|workers?|db|data)(?:\/|$)|\.(?:route|service|adapter|handler|repo|dao)\.[jt]sx?$/i;

/** Paths that ship to a browser. A secret here is a published secret. */
const CLIENT_PATH = /(?:^|\/)(?:app|src|components?|pages|islands|public|static|client|web|ui)(?:\/|$)/i;

export const SPINE_BANS = {
  /** Law 4 — secrets never enter history. A key that touched history is rotated, not deleted. */
  secrets: [
    { re: /\bsk-ant-[A-Za-z0-9_-]{8,}/g, msg: 'Anthropic key literal in source. Move to an env var and ROTATE it — it is in git history now.' },
    { re: /\bsk-(?:proj-)?[A-Za-z0-9]{20,}/g, msg: 'OpenAI-style key literal in source. Move to an env var and ROTATE it.' },
    { re: /\bAIza[0-9A-Za-z_-]{30,}/g, msg: 'Google API key literal in source. Move to an env var and ROTATE it.' },
    { re: /\bgh[pousr]_[A-Za-z0-9]{20,}/g, msg: 'GitHub token literal in source. Move to an env var and ROTATE it.' },
    { re: /\bxox[baprs]-[A-Za-z0-9-]{10,}/g, msg: 'Slack token literal in source. Move to an env var and ROTATE it.' },
    { re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./g, msg: 'JWT literal in source. Do not commit tokens, even expired ones.' },
    { re: /\bAuthorization\s*:\s*['"`]\s*Bearer\s+(?!\$\{|['"`]\s*\+|process\.env)[A-Za-z0-9._-]{12,}/g, msg: 'Hardcoded Bearer credential. Read it from the environment.' },
    { re: /console\.(?:log|info|warn|debug)\s*\([^)]*\b(?:api_?key|apiKey|secret|password|passwd|token|credential)\b/gi, msg: 'Logging a credential. Redact it or remove the log.', severity: 'warn' },
  ],

  /** Law 3 — every number honest about what it is. The back half of §20's provenance ban. */
  honesty: [
    {
      re: /\bMath\.random\s*\(/g, paths: DATA_PATH,
      msg: 'Math.random() on a data path fabricates a value. Fail closed and return nothing instead — a fake number shown as live costs more than an error.',
    },
    {
      re: /\bMath\.(?:sin|cos)\s*\(/g, paths: DATA_PATH,
      msg: 'Trigonometric synthesis on a data path invents a plausible-looking series. If there is no upstream reading, return empty and label it.',
      severity: 'warn',
    },
    {
      re: /\bcatch\s*(?:\([^)]*\))?\s*\{\s*\}/g,
      msg: 'Empty catch swallows the failure. An error the operator never sees becomes a number the reader trusts.',
    },
    {
      re: /\bcatch\s*(?:\([^)]*\))?\s*\{\s*(?:\/\/[^\n]*)?\s*return\s+(?:\[\s*\]|\{\s*\}|null|undefined)\s*;?\s*\}/g,
      msg: 'Catch returns an empty payload with no signal. Say WHY it is empty — set a source/status field the client can read.',
      severity: 'warn',
    },
  ],

  /** Law 5 — validate at every trust boundary. */
  boundaries: [
    { re: /`\s*SELECT\b[^`]*\$\{/gi, msg: 'SQL built by string interpolation. Use a parameterised query.' },
    { re: /`\s*(?:INSERT|UPDATE|DELETE)\b[^`]*\$\{/gi, msg: 'SQL built by string interpolation. Use a parameterised query.' },
    { re: /\bSELECT\s+\*\s+FROM\b/gi, msg: 'SELECT * couples the response to the schema. Name the columns.', severity: 'warn' },
    { re: /\bJSON\.parse\s*\(\s*(?:await\s+)?(?:res|response|r)\.text\s*\(\s*\)/g, msg: 'Parsing an upstream body with no schema check. Validate at the boundary.', severity: 'warn' },
  ],

  /** Law 2 — no public endpoint holds a paid key without auth and a rate limit. */
  exposure: [
    {
      re: /\b(?:api\.anthropic\.com|api\.openai\.com|generativelanguage\.googleapis\.com)\b/g, paths: CLIENT_PATH,
      msg: 'Model API called from a path that ships to the browser. That publishes the key. Proxy it server-side.',
    },
    { re: /\b(?:localhost|127\.0\.0\.1)(?::\d+)?\b/g, paths: CLIENT_PATH, msg: 'localhost in shipped source. It resolves to the visitor\'s machine, not yours.', severity: 'warn' },
    { re: /\bcontinue-on-error\s*:\s*true/g, msg: 'continue-on-error turns a red gate green. A check that cannot fail is not a check.', severity: 'warn' },
    { re: /\b(?:npm|pnpm|yarn)\s+(?:run\s+)?test[^\n|&]*\|\|\s*true/g, msg: '`|| true` on a test step makes the build lie. Remove it.' },
  ],
};

/** Rule groups that only make sense in a server/data file. */
export const SPINE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.sql', '.yml', '.yaml'];
