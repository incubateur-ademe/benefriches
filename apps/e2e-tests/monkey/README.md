# Monkey agent

Runs Claude Code headless (Sonnet) with the Playwright MCP server against a deployed webapp, e.g. staging. The agent explores the app as a user, tries to find bugs and writes down each scenario it tried. Meanwhile the runner records the hard errors of the browser without the LLM, and writes a scenario log and a Markdown summary.

## Run it

Needs the `claude` CLI logged in and Google Chrome installed (Playwright MCP drives it).

```bash
BASE_URL=https://<staging host> \
E2E_TESTMAIL_NAMESPACE=<namespace> \
E2E_TESTMAIL_API_KEY=<api key> \
pnpm --filter e2e-tests monkey
```

- `BASE_URL`: the webapp to explore.
- `E2E_TESTMAIL_NAMESPACE`, `E2E_TESTMAIL_API_KEY`: the testmail.app namespace of the e2e suite (see [../AGENTS.md](../AGENTS.md)).
- Budgets: the run stops at the first one it exhausts.
  - `MONKEY_MAX_TURNS` (default 150): agent turns, enforced by Claude Code (`--max-turns`).
  - `MONKEY_TIMEOUT_MINUTES` (default 30): wall-clock time.
  - `MONKEY_MAX_COST_USD` (default 5): API cost, enforced by Claude Code (`--max-budget-usd`).
  - `MONKEY_MAX_HARD_ERRORS` (default 5): distinct hard errors.
- `MONKEY_HEADED=true` (optional): show the Chrome window instead of running headless.
- `MONKEY_SEED` (optional, an integer from 0 to 4294967295): the seed of the run plan. Random by default; the run prints its seed first, so `MONKEY_SEED=<seed>` replays the same plan.

Exit code: 1 when the run found at least one hard error, 2 when the agent or the runner failed (e.g. `claude` not logged in, registration refused), 0 otherwise. Suspicions alone never fail the run, and neither does a budget.

## Run it in CI

The [Monkey agent on staging workflow](../../../.github/workflows/monkey-agent-staging.yml) runs the same command against staging, on manual trigger only: `gh workflow run monkey-agent-staging.yml`, or `gh workflow run monkey-agent-staging.yml -f seed=<seed>` to replay a run.

- It runs in the `staging` GitHub environment: `WEBAPP_BASE_URL` (passed as `BASE_URL`), the testmail.app secrets of the nightly e2e run and the `ANTHROPIC_API_KEY` secret, which Claude Code uses instead of a login. It installs a pinned Claude Code and uses the Google Chrome of the runner.
- The budgets are the defaults above. The monkey step times out after 35 minutes, which stops the run with a signal so it still writes its summary, and the job after 45 minutes. Its concurrency group `monkey-agent-staging` queues a second run instead of running both.
- The job is red when the run exits with 1 (a hard error) or 2 (the agent or the runner failed), green otherwise.
- The job summary is the run's `summary.md`. The `monkey-run` artifact (14 days) is the run folder, without `storage-state.json` (the session cookies of the run's user).
- No schedule yet: a weekly one is added once a few manual runs have found at least one real bug with fewer than about half of their findings being noise. It must stay away from the nightly e2e run at 03:00 UTC.

## Read a report

1. Start with the job summary (or `summary.md`): how the run stopped, its budgets, the scenario table and the findings of each scenario.
2. Hard errors are facts recorded by the browser, not by the agent: open their screenshot and excerpts in `hard-errors/`, and check whether they come from the app or from the run (e.g. a 4xx caused by a made-up URL the agent typed).
3. Suspicions are the agent's opinion, with a confidence: reproduce one by hand before filing it. `narrative.md` says what the agent did and saw around it, `playwright/session-*/session.md` shows every tool call and the page it got back.
4. Replay a run with its seed (first line of the log, and `seed` in `scenarios.json`) to draw the same plan. The agent won't take exactly the same steps.

## Run plan

Each run draws a plan from its seed ([run-plan.ts](run-plan.ts)): a persona (novice, expert, saboteur, returning user), a site nature, a project type, a creation mode (express or custom) and 2 or 3 quirks (browser back button or reload mid-wizard, extreme values, double submit, project duplication, edit after creation). The same seed always draws the same plan. The plan is a nudge: the agent may deviate and writes a `Deviation:` line when it does.

The prompt is [prompt.md](prompt.md): role and goal, the plan, guardrails (no external links, no ProConnect, no contact, feedback or newsletter form, fake data only, never type "NaN" or "undefined", an admin page seen is a critical finding), the automatic checks, bug severities, reporting protocol (`## Scenario:`, `Outcome:`, `Suspicion: [severity] [confidence] …`, `Deviation:` lines) and stop conditions. [glossary.md](glossary.md) gives the agent the domain vocabulary and is appended to it. The browser viewport is desktop only (1440×900).

## What it does

1. Registers a fresh user through the API with a testmail.app address tagged `e2e-monkey-<uuid>`, and saves its session cookies as a Playwright storage state: the agent starts logged in and never reads the mailbox.
2. Starts `claude --print` with [prompt.md](prompt.md), the run plan and [glossary.md](glossary.md), no built-in tool (no shell, no file access, no web fetch) and the Playwright MCP server only. `browser_run_code_unsafe` is denied: it runs Playwright code outside the browser context.
3. Playwright MCP loads [hard-error-detector.ts](hard-error-detector.ts) on every page (`initPage`): it records hard errors (see below) in `hard-errors/`. The runner reads them every second, merges them into the scenario log and stops the agent at `MONKEY_MAX_HARD_ERRORS`.
4. The browser context only allows requests to `BASE_URL`, testmail.app and data.geopf.fr (address search, needed by the site wizard): any other host fails with `net::ERR_BLOCKED_BY_CLIENT`. This is not a security boundary: it does not apply to redirects.

## Hard errors

Playwright MCP only shows console messages and network requests when the agent asks for them (`browser_console_messages`, `browser_network_requests`), so they can't detect anything by themselves. [hard-error-detector.ts](hard-error-detector.ts) runs in the Playwright MCP server process instead and listens to every page of the target origin:

| Type            | Severity | When                                                                                                                                                                 |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `admin-access`  | critical | a 2xx response of `/api/admin/*`, or a page under `/admin` that shows something else than "Accès réservé aux administrateurs" for 2 scans in a row                   |
| `blank-page`    | critical | a page without any text for 3 scans in a row                                                                                                                         |
| `server-error`  | major    | an HTTP 5xx response                                                                                                                                                 |
| `client-error`  | major    | an HTTP 4xx response, except 429 (rate limit), 401 and 403 of `/api/admin/*` (not an admin) and a 404 on a GET of an id the page URL names (a made-up or deleted id) |
| `js-exception`  | major    | an uncaught exception (`pageerror`)                                                                                                                                  |
| `broken-text`   | major    | "NaN" or "undefined" as a word in the page text                                                                                                                      |
| `console-error` | minor    | a `console.error`, except Chrome's "Failed to load resource" (responses are classified on their own) and requests blocked by the allowlist                           |

Responses of other origins (testmail.app, data.geopf.fr) are ignored. The page text is scanned every 1.5 s.

Each hard error has a fingerprint, a hash of its type, its message and its route (the page URL without origin, ids replaced by `:id`). The first time a fingerprint shows up, the detector takes a screenshot and keeps the last 15 console messages and requests of the page as excerpts; later occurrences only count (`occurrences`). The hard-error budget counts distinct fingerprints.

`pnpm --filter e2e-tests test:monkey-browser` checks the detector against a real Chromium: an injected exception, a failing request and a visible "NaN" each produce a hard error with a screenshot and excerpts. It runs in the [End-to-end tests workflow](../../../.github/workflows/e2e-tests.yml), which installs Chromium.

## Output

Each run writes `monkey-runs/<timestamp>/` (git-ignored):

- `scenarios.json`: the scenario log (see below), rewritten after every agent message and every hard error.
- `summary.md`: the Markdown summary of the scenario log, rewritten with it: the run, its budgets, the scenarios with their outcome, and each finding with its evidence, screenshot and excerpts. When `GITHUB_STEP_SUMMARY` is set, the final summary is appended to it, i.e. to the GitHub job summary.
- `hard-errors/hard-errors.jsonl`: the detector's records, one JSON object per line: `{ "kind": "hard-error", "hardError": … }` or `{ "kind": "repeat", "fingerprint", "timestamp" }`. `hard-errors/hard-error-<n>-<type>.png`: their screenshots.
- `narrative.md`: the plan, then everything the agent wrote, and what stopped the run.
- `plan.json`: the seed and the plan drawn from it, written before the agent starts.
- `transcript.jsonl`: the Claude Code `stream-json` transcript.
- `playwright/session-*/session.md`: the raw Playwright MCP log of every tool call and its result.
- `playwright/*.png`: the agent's screenshots; `playwright/*.yml`: page snapshots; `playwright/console-*.log`: browser console.

## Scenario log

`scenarios.json` is written atomically (temporary file, then rename) each time it changes, so it is valid JSON even when the run is killed: a killed run has `run.status` `"running"`. Types: [scenario-log.ts](scenario-log.ts).

```jsonc
{
  "version": 1,
  "runId": "2026-10-29T10-00-00.000Z", // the run folder name
  "baseUrl": "https://staging.example.org",
  "userEmail": "…@inbox.testmail.app", // the user the agent was logged in as
  "seed": 42,
  "plan": { "seed": 42, "persona": "saboteur", "siteNature": "FRICHE", "…": "…" }, // plan.json
  "budgets": { "maxTurns": 150, "timeoutMs": 1800000, "maxCostUsd": 5, "maxHardErrors": 5 },
  "startedAt": "…", // ISO 8601
  "updatedAt": "…",
  // or { "status": "running" }
  "run": { "status": "finished", "stopReason": "completed", "endedAt": "…" },
  "usage": { "turns": 87, "costUsd": 2.41 }, // null until Claude Code reports them, at the end
  "hardErrorCount": 1, // hard error findings, i.e. distinct fingerprints
  "suspicionCount": 1,
  "scenarios": [
    {
      "id": "2026-10-29T10-00-00.000Z-s1", // <runId>-s<n>
      "seed": 42,
      "persona": "saboteur",
      "goal": "Create an express friche", // the agent's `## Scenario:` line
      "startedAt": "…",
      "steps": [{ "timestamp": "…", "tool": "browser_click", "target": "Valider" }], // browser tool calls
      "inputs": [{ "timestamp": "…", "field": "Nom du site", "value": "Friche 1" }], // typed, filled in or selected
      "outcome": "hard_error", // "ok" | "suspicion" | "hard_error": the worst of its findings
      "agentOutcome": "The site was not created.", // the agent's `Outcome:` line, or null
      "deviations": ["express instead of custom: …"], // the agent's `Deviation:` lines
      "findings": [
        {
          "kind": "hard_error",
          "type": "server-error", // see Hard errors
          "severity": "major", // "critical" | "major" | "minor"
          "evidence": "500 POST /api/sites/create-express",
          "url": "https://staging.example.org/creer-site-foncier/demo?etape=demo-superficie",
          "route": "/creer-site-foncier/demo?etape=demo-superficie",
          "fingerprint": "3f9a0c1b2d4e",
          "timestamp": "…",
          "occurrences": 2,
          "screenshotPath": "hard-errors/hard-error-1-server-error.png", // relative to the run folder, or null
          "consoleExcerpt": ["[log] …"],
          "networkExcerpt": ["POST https://…/api/sites/create-express => 500"],
        },
        {
          "kind": "suspicion", // the agent's `Suspicion:` line
          "severity": "minor",
          "confidence": 0.6, // from 0 to 1
          "evidence": "…",
          "timestamp": "…",
        },
      ],
    },
  ],
}
```

- `stopReason`: `completed` (the agent ended by itself), `turn-limit`, `time-limit`, `cost-limit`, `hard-error-limit`, `interrupted` (Ctrl-C or SIGTERM) or `error` (the agent failed).
- Steps and agent texts are stamped when the runner receives them; hard errors when the detector sees them. A hard error belongs to the scenario running at its timestamp, findings are ordered by timestamp. What happens before the first `## Scenario:` line belongs to the first scenario; a run without any has one "Unnamed exploration" scenario.
