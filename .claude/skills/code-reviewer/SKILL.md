---
name: code-reviewer
description: Reviews code for bugs, security vulnerabilities, and quality issues. MUST be invoked automatically after completing a coding task (feature, bug fix, or refactor) - do not wait for user to request it. Also use when the user asks to review changes, check a diff, or look over a branch/PR before committing.
effort: medium
allowed-tools: Bash, Read, Grep, Glob
---

# Code Review

Review recent code changes for quality, security, maintainability, and adherence to project patterns.

## 1. Get recent changes

Run `git diff` to see uncommitted changes. If there are none, run `git diff HEAD~1` to review the last commit. Focus on the modified files and analyze them thoroughly.

## 2. Select review lenses

The detailed checklists live in `reference/` and are organized by domain so you only load what's relevant. Read the file(s) matching the changed paths:

| Changed paths | Read |
|---|---|
| **Every review** | [`reference/cross-cutting.md`](reference/cross-cutting.md) — security, TypeScript/erasability, test-design antipatterns, code quality, performance |
| `apps/api/**` | [`reference/api.md`](reference/api.md) — Clean Architecture, Result pattern, controllers, CQS, database, DI, naming, testing |
| `apps/web/**` | [`reference/web.md`](reference/web.md) — Clean Architecture, Redux, Container/Presentational, hooks, gateways, naming, testing |
| `packages/shared/**` | **Both** [`reference/api.md`](reference/api.md) **and** [`reference/web.md`](reference/web.md) — shared changes break both apps — plus verify type/DTO/Zod-schema placement per [`packages/shared/CLAUDE.md`](../../../packages/shared/CLAUDE.md) |
| `apps/e2e-tests/**` | [`apps/e2e-tests/CLAUDE.md`](../../../apps/e2e-tests/CLAUDE.md) — Page Object pattern, fixtures, spec structure |

If a change touches paths not listed above, still apply `cross-cutting.md` and use judgment. Each lens links to the canonical rule (`.claude/rules/…`) for full detail; those rules also auto-load when you Read the changed files. The reference files are the review checklist (what to flag); the rules are the spec (how to write it). Don't re-derive a rule's content — cite it.

## 3. Confidence-based filtering

**Only report issues you are highly confident about.**

- ✅ **HIGH** — clear violation visible in the diff (missing `@UseGuards(JwtAuthGuard)`, `core/` importing `adapters/`, UseCase not returning `TResult<>`, TypeScript `enum`, missing table type after migration). Report.
- ⚠️ **MEDIUM** — probable but needs context (large functions/files, possibly-missing tests). Report with the caveat "Possible issue (verify context)…".
- ❌ **LOW** — needs deep codebase knowledge, may have valid reasons not visible in the diff, or is style-only. Skip.

**When in doubt, skip it** — focus on clear, actionable problems.

## 4. Output format

For each issue:

```
[SEVERITY] Issue title
File: path/to/file.ts:line
Issue: what's wrong
Fix: how to resolve it

// Bad
<snippet>

// Good
<snippet>
```

**Severity**: CRITICAL (security, architecture, type safety) · HIGH (missing tests, pattern violations, significant bugs) · MEDIUM (performance, maintainability) · LOW (style).

## 5. ADR check

If the changes involve an architectural decision worth documenting (new pattern/abstraction, new library/tool, a convention future code should follow, or a significant structural change), add:

```
💡 **ADR suggestion**: These changes introduce [brief description]. Consider running `/adr` to document this architectural decision.
```

If the changes follow existing patterns, skip this section silently.

## 6. Summary

End with:

```
## Review Summary
- Critical: X · High: X · Medium: X · Low: X

## Verdict
- ✅ APPROVE: no Critical or High issues
- ⚠️ CAUTION: Medium issues only (proceed with awareness)
- ❌ BLOCK: Critical or High issues must be fixed
```

## Scope

$ARGUMENTS

If no scope is provided, review all uncommitted changes.

## Notes

- Prioritize **architecture** and **security** violations; be concise but actionable, with clear fixes.
- Reviews often span both apps — read every reference file whose paths were touched.
