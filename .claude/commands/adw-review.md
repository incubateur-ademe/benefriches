---
description: Review an ADW branch against its spec and return a verdict (ADW review step)
argument-hint: <spec-path> <base-ref>
model: opus
---

Review the commits on the current branch since `$2` against the spec at `$1`, and write the review to `review.md` in the spec's directory. Edit nothing else: no file in the worktree, no git state (no commit, checkout, stash, reset). You may run read-only and test commands (`git diff`, `git log`, focused tests, the spec's Validation commands) to confirm a finding.

1. Record `git status --porcelain`. It must be identical when you finish; if a command you ran changed it, say so in `review.md`.
2. Read the spec, then `git log --oneline $2..HEAD` and `git diff $2...HEAD`.
3. Invoke the `code-reviewer` skill with the Skill tool, scope `git diff $2...HEAD`, and follow it.
4. Check the diff against the spec: the Approach and every item under Files are implemented, or the deviation is explained; the tests listed under Validation exist.
5. Classify every finding, citing `file:line`:
   - **blocker**: the spec is not met, or a Critical or High finding that this diff introduces. Blockers send the branch back to the builder, so each one says what to change.
   - **tech debt**: a Medium finding, or a real problem outside the spec's scope or that predates this diff. Each one becomes a follow-up issue, so it must stand alone: what, where, why it matters.
   - Drop Low findings.
6. Write `review.md`: the verdict, the blockers, the tech debt, then what you checked (commands run and their results).

Approve only when there are no blockers. End your final message with the verdict, alone in a `json` code block:

```json
{
  "approve": false,
  "blockers": [
    {
      "title": "...",
      "location": "path:line",
      "detail": "what is wrong and what to change"
    }
  ],
  "techDebt": [
    {
      "title": "...",
      "location": "path:line",
      "detail": "what, where, why it matters"
    }
  ]
}
```
