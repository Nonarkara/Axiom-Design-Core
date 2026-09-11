# AXIOM SPINE — The Back Half

> `AXIOM-DNA.md` governs what the reader sees. This governs what reaches them,
> and whether it is true.

**Status:** v1, 2026-09-11. Machine-checked where a machine can check it —
`npx axiom-audit .` runs this file's rules as the `back` and `seam` layers.

---

## 0. DROP-IN SYSTEM PROMPT

```
Build the server half to AXIOM SPINE. Every value that reaches a screen carries
its source, its tier and its age. A route that cannot answer truthfully returns
nothing and says why — it never invents a plausible number. Validate at every
boundary, keep secrets out of source, and put auth and a rate limit in front of
anything that spends money. If the front half cannot read a signal, the signal
does not exist.
```

---

## 1. THE CREDO

`AXIOM-DNA §20` already bans **data without provenance**. That ban was
unenforceable for as long as this repository was frontend-only: nothing here
produced provenance, and nothing checked that anything consumed it. This file is
the other half of that one line.

**The equation.** Where the front half is *MoMA Law × Golden Section × Divine
Move*, the back half is:

> **Conservation × Provenance × Fail-Closed**

- **Conservation** — state the invariant before writing the code. Every
  non-trivial system has one quantity that must balance by arithmetic
  (`demand = served + abandoned + waiting`, `balance = credits − debits`,
  `requests = success + error + timeout`). If you cannot write it in one line,
  you do not understand the system yet, and the numbers you ship will look right
  until they don't.
- **Provenance** — a number with no source, tier and age is a rumour with
  tabular figures.
- **Fail-closed** — the honest empty answer beats the plausible invented one. An
  error costs a demo. A fabricated number costs the company.

**The tenet that outranks the rest:** *honesty over polish.* It is already on
`§21.2`'s untouchable list. This file is what it means on a server.

---

## 2. THE LAYERS

Three, and a file belongs to exactly one. Naming follows the conventions an
analyser can actually detect from directory structure — taxonomy adapted from
`Egonex-AI/Understand-Anything`, whose node vocabulary (`endpoint`, `service`,
`table`, `schema`, `pipeline`, `resource`) is the clearest cross-framework
naming of backend concerns available.

| Layer | Directories | Holds | Never holds |
|---|---|---|---|
| **api** | `api/ routes/ handlers/ pages/api/ functions/` | request parsing, auth check, envelope construction | business rules, SQL |
| **service** | `services/ core/ domain/ lib/ jobs/ workers/` | the invariant, the decisions, the arithmetic | request objects, response shapes |
| **data** | `db/ schema/ migrations/ adapters/ repo/` | queries, mappings, migrations | policy, formatting |

A rule in this file that only makes sense on a server carries a `paths` scope, so
a `Math.random()` in a UI animation is not flagged and a `Math.random()` in a
data adapter is.

---

## 3. THE ENVELOPE

Every `/api/*` response has one shape. Not one per route.

```ts
type Envelope<T> =
  | { success: true;  data: T;    meta: Meta }
  | { success: false; data: null; error: { code: ErrorCode; message: string } };
```

- **Never throw a raw error to a client.** An unhandled stack trace is both a
  leak and a lie about what happened.
- **The envelope is not optional on the happy path.** A route that returns a bare
  array on success and an envelope on failure forces every caller to write two
  parsers, and the second one is always wrong.
- **Status codes carry meaning, and `200` is a claim.** `200` says *this is the
  answer*. Use `503` when an upstream is down, `400` when the caller is wrong,
  `404` only when the thing genuinely does not exist. A `200` carrying an empty
  array because the database was unreachable is the single most expensive lie a
  back half can tell, because the front half cannot tell it from real emptiness.

---

## 4. THE HONESTY ENVELOPE

**Every displayed value carries `{source, tier, age}`.** This is `§4`'s whole
reason to exist and the hinge the seam turns on.

```ts
interface Meta {
  source: string;            // "NASA FIRMS", "Postgres events", "in-process cache"
  tier: 'live' | 'cached' | 'stored' | 'fallback' | 'unavailable';
  observedAt: string | null; // ISO 8601 — when the SOURCE observed it
  builtAt: string;           // ISO 8601 — when THIS response was assembled
}
```

**`observedAt` and `builtAt` are different facts and must never be merged.** A
response assembled one second ago can be built entirely from rows three days
old. A client that shows `builtAt` as freshness is reporting its own latency and
calling it data age. This is the most common provenance bug there is, and it is
invisible until someone asks how old the number is.

**Tier, stated precisely:**

| Tier | Means | May it render as a value? |
|---|---|---|
| `live` | fetched from the source this request | yes |
| `cached` | a recent good answer, age stated | yes, with age |
| `stored` | from our own durable snapshot | yes, with age |
| `fallback` | a real prior reading, now stale | yes, visibly marked |
| `unavailable` | we have nothing | **no — render the absence** |

**An empty result and an unavailable result are different answers.** Zero fires
observed is a finding. No fire data is an outage. A back half that returns `[]`
for both has destroyed the distinction before the front half ever sees it, and
`FIRMS 0 hotspots` will render as a confident fact.

**Fabrication is banned, and named.** `Math.random()`, `Math.sin()` and the
lorem-ipsum of plausible series have no place on a data path. If GDELT is
unreachable, the answer is an empty timeline and `tier: 'unavailable'` — not a
sine wave that draws identically to real sentiment. `axiom-audit` fails the build
on both functions inside `api/ services/ lib/ db/`.

---

## 5. ERRORS

- **A closed set of codes, declared in one place**, the way colours are. An
  error string invented at the throw site is the backend's off-scale spacing
  value.
- **Never an empty catch.** `catch {}` converts a failure the operator could
  have fixed into a number the reader trusts. `axiom-audit` treats it as an
  error.
- **Never a silent fallback.** A catch that returns `[]` with no tier change is
  worse than a crash: it manufactures emptiness. Set the tier, then return.
- **Log the failure, return the envelope.** Both. One without the other is either
  an invisible outage or an unactionable alert.

---

## 6. TRUST BOUNDARIES

Anything crossing into the process is untrusted: request bodies, query strings,
webhook payloads, upstream JSON, environment values, database rows written by an
older version of your own code.

- **Validate at ingestion, with a schema, and fail loud.** Malformed upstream
  data must break at the boundary, not three layers in where the stack trace no
  longer names the cause.
- **Parameterise every query.** SQL assembled by string interpolation is flagged
  as an error, not a warning. `SELECT *` couples the wire format to the schema —
  name the columns.
- **"Logged in" is a server-side fact.** Never a client boolean, never a header
  the client can set.
- **Verify every webhook signature server-side** before reading the body.

---

## 7. SECRETS

- **A secret never enters source, and never enters history.** `axiom-audit`
  matches the literal shapes: `sk-ant-`, `sk-`, `AIza`, `gh[pousr]_`, `xox[baprs]-`,
  and bare JWTs.
- **A key that touched a commit is rotated, not deleted.** Removing the line
  changes nothing; the object is still in the pack file and on every clone.
- **Never log a credential**, including at `warn`. Redact at the call site.
- **A model API called from a path that ships to the browser publishes the key.**
  Proxy it. `axiom-audit` scopes this rule to client paths precisely because the
  same call is correct on a server and fatal in a bundle.

---

## 8. EXPOSURE

- **No public endpoint holds a paid key without auth and a rate limit in front
  of it.** Until it does, it is not public.
- **`continue-on-error: true` and `|| true` turn a red gate green.** A check that
  cannot fail is not a check; it is a green badge over an untested system.
- **State the tier you are selling.** Demo may fake data *visibly*. Pilot needs
  the honesty envelope and critical-path tests. Production needs all of it plus a
  restore you have actually performed. Selling a demo as production is what kills
  companies, and it is the one failure this whole file exists to make impossible
  by accident.

---

## 9. THE SEAM

**This is the keystone, and the reason the two halves ship as one core.**

A signal only exists if both halves honour it. The back half emitting
`X-Data-Source: unavailable` and the front half never reading it is not a partial
implementation — it is worse than no signal at all, because the next person to
open the route sees a provenance header and assumes provenance works.

The contract:

| Direction | Rule |
|---|---|
| back → front | every tier that can render differently is carried on the wire: `meta` in the body, `X-Data-Source` / `X-Data-Age` on the headers |
| front → back | every header the back half sets is read by something, or deleted |
| both | `observedAt` crosses the wire. A client must never have to infer data age from its own clock |

`axiom-audit` checks both directions:

- **`seam-orphan-producer`** *(error)* — a header set by a route and read by no
  client. Wire it in or delete it.
- **`seam-orphan-consumer`** *(warn)* — a header read by a client and set by no
  route. It will silently take its default forever. Legitimate when the producer
  is a separate service — waive it with a reason.

**The front half's own laws depend on this.** `§20`'s "data without provenance"
and `§19`'s legibility floor are both unverifiable from inside a stylesheet.
`axiom-audit`'s seam layer computes the contrast of every token pair in
`tokens.css` against `§19` rather than trusting the prose, which is how
`--ink-3` was found sitting at 2.26:1 on the token `§6.2` assigns to the 9px
micro-label — below both floors, in the section that opens *"a thing you cannot
read is a thing that does not work."* Every pair `§19` named passed. The one it
did not name was the one that failed.

---

## 10. HARD BANS (BACK)

- ❌ A fabricated value on a data path — `Math.random()`, synthesised series
- ❌ `200` carrying an outage
- ❌ An empty catch, or a silent fallback that does not change tier
- ❌ A secret in source, in a log, or in history
- ❌ A model API key in a browser bundle
- ❌ SQL by string interpolation
- ❌ An unvalidated boundary
- ❌ A public paid endpoint with no auth and no rate limit
- ❌ `continue-on-error` / `|| true` on a gate
- ❌ A header produced and never consumed
- ❌ `builtAt` presented as data age
- ❌ Selling a tier the system has not reached

---

## 11. THE CHECKLIST

Run before shipping anything with a server in it.

1. Can you state the conservation law in one sentence?
2. Does every response carry `{source, tier, age}`?
3. Is `observedAt` distinct from `builtAt`, on the wire, and read by the client?
4. Does an outage produce a different answer than a genuine zero?
5. Is every boundary schema-validated?
6. Does `npx axiom-audit . --strict` exit 0?
7. Is every waiver accompanied by a reason (`grep -rn axiom-audit-ignore`)?
8. Does every header you set get read by something?
9. Has the restore been performed, not just configured?
10. Are you stating the tier you actually reached?

---

## 12. WHAT A MACHINE CANNOT CHECK

The conservation law. A linter can prove your spacing is on scale and your keys
are not in source; it cannot tell you that `demand = boarded + abandoned +
waiting` is the right invariant, or that you have modelled the wrong thing
correctly. That is the one item on this list that needs a person, which is why
the other eleven are automated — so the attention is left over for it.
