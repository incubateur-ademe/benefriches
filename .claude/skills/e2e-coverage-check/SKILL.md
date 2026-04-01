---
name: e2e-coverage-check
description: >
  Analyze current branch changes vs main and determine whether e2e tests need to be
  created or updated. Produces a structured report with coverage gaps and recommendations.
  Use after completing a feature or before creating a PR.
effort: medium
allowed-tools: Agent
user-invocable: true
---

# E2E Coverage Check

Analyze whether current branch changes require new or updated e2e tests.

## When to Use

- After completing a feature implementation, before creating a PR
- When changes touch views, wizard steps, routes, controllers, or shared DTOs
- To verify that new user-facing flows have adequate e2e test coverage

## Instructions

1. Launch the `e2e-coverage-checker` agent with this prompt:

   > Analyze the current branch's changes against main and produce an e2e coverage check report. Follow your instructions step by step: collect the diff, classify files, run the deep pass where needed, map coverage, and generate the report.

2. Relay the agent's report to the user exactly as produced. Do not summarize or modify it.
