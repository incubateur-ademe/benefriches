# Monkey agent

Runs Claude Code headless (Sonnet) with the Playwright MCP server against a deployed webapp, e.g. staging. The agent explores the app as a user, tries to find bugs and writes down each scenario it tried.

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
- `MONKEY_MAX_TURNS` (default 60) and `MONKEY_TIMEOUT_MINUTES` (default 20): the run stops by itself at whichever comes first.
- `MONKEY_HEADED=true` (optional): show the Chrome window instead of running headless.

## What it does

1. Registers a fresh user through the API with a testmail.app address tagged `e2e-monkey-<uuid>`, and saves its session cookies as a Playwright storage state: the agent starts logged in and never reads the mailbox.
2. Starts `claude --print` with [prompt.md](prompt.md), no built-in tool (no shell, no file access, no web fetch) and the Playwright MCP server only. `browser_run_code_unsafe` is denied: it runs Playwright code outside the browser context.
3. The browser context only allows requests to `BASE_URL`, testmail.app and data.geopf.fr (address search, needed by the site wizard): any other host fails with `net::ERR_BLOCKED_BY_CLIENT`. This is not a security boundary: it does not apply to redirects.

## Output

Each run writes `monkey-runs/<timestamp>/` (git-ignored):

- `narrative.md`: the scenarios the agent wrote down, and what stopped the run.
- `run.json`: target, user email, stop reason (`completed`, `turn-limit`, `time-limit` or `error`), turns and cost.
- `transcript.jsonl`: the Claude Code `stream-json` transcript.
- `playwright/session-*/session.md`: the raw Playwright MCP log of every tool call and its result.
- `playwright/*.png`: screenshots; `playwright/*.yml`: page snapshots; `playwright/console-*.log`: browser console.

The agent reads console messages and network requests on demand with the `browser_console_messages` and `browser_network_requests` tools; requests blocked by the allowlist show up there as failed.
