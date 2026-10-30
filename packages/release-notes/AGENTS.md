# Release notes

Posts a French release note (Adaptive Card) to Microsoft Teams after a production deploy: summarises the commits since the previous successful deploy with Claude. Run in CI by the `notify-release` job of [deploy-production.yml](../../.github/workflows/deploy-production.yml); it never fails the workflow.

- Run by Node directly (type stripping, no build step): `pnpm --filter release-notes start`.
- `pnpm --filter release-notes dry-run` (`--dry-run`) prints the card JSON and posts nothing to Teams, but still calls the LLM, so it needs `ANTHROPIC_API_KEY`.
- Env vars: `RUN_NUMBER`, `CURRENT_COMMIT`, `GITHUB_REPOSITORY`, `PREVIOUS_COMMIT` (no previous commit: nothing posted), `ANTHROPIC_API_KEY` (missing: plain card without summary), `TEAMS_RELEASES_WEBHOOK_URL` (not needed with `--dry-run`).
- The Claude model name is a single constant, `MODEL` in [src/llm.ts](src/llm.ts).
- It reads the root [CONTEXT.md](../../CONTEXT.md) glossary at runtime to word the note: keep that file's French UI terms accurate.
- No unit tests, by decision: check changes with `--dry-run`.
