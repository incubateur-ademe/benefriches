---
description: Walk an ADW spec's scenarios in a browser and return a verdict (ADW QA step)
argument-hint: <spec-path>
model: opus
---

Walk the Scenarios of the spec at `$1` in a real browser against this worktree's e2e stack. Write `qa.md` in the spec's directory and the screenshots in a `qa/` folder beside it. Change no file in the worktree: QA observes the app, it does not fix it.

If Scenarios is `None`, write `qa.md` saying so and return a pass.

1. Read `.e2e-stack` at the repository root: the app is at `BASE_URL`, the API at `API_URL`, the mail catcher at `MAILCATCHER_URL`, the database at `DATABASE_URL`. Use only these. If the file is missing or the app does not answer, stop and report an environment failure, not a QA verdict.
2. Drive the browser with the Playwright MCP tools. If they are missing, stop and say the session must be started with `--mcp-config adws/mcp/playwright.json`.
3. Collect the design: images and PDFs in the `attachments/` folder beside the spec, and Figma links in `issue.md` (read them with the Figma MCP server when it is available).
4. Set up each scenario's starting state the way the e2e fixtures do (`apps/e2e-tests/AGENTS.md`): a fresh user, sites and projects seeded through the API, the database only for what the API cannot do. Never seed the behaviour the scenario checks.
5. Walk each scenario as a user would, through the UI, then check its expected result on the page. Take at least one screenshot per scenario, at the expected result, and copy it to `qa/<n>-<slug>.png`.
6. A scenario fails when its expected result does not hold, or when you cannot run it (setup impossible, step unclear). Record the steps, expected, observed and the screenshot. Never retry until it passes: a failure seen once is reported.
7. Compare every screen that has a mockup with it, by eye. Differences (layout, wording, colour, a missing element) are observations, not failures, unless the scenario's expected result requires that element.

Write `qa.md`: the verdict, one section per scenario (steps, expected, observed, screenshot, pass or fail), then the observations against the mockups.

Pass only when no scenario failed. End your final message with the verdict, alone in a `json` code block:

```json
{
  "pass": false,
  "failures": [
    {
      "scenario": "...",
      "expected": "...",
      "observed": "...",
      "screenshot": "qa/1-....png"
    }
  ],
  "observations": [
    { "screen": "...", "mockup": "attachments/....png", "difference": "..." }
  ]
}
```
