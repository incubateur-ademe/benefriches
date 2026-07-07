---
name: reflect
description: Reflect on the current session to find mistakes, user corrections, ambiguous instructions, and failures — then propose durable root-cause fixes to the project's instruction docs (CLAUDE.md, .claude/rules, .claude/skills) so they don't recur. Use when the user asks to reflect on the session, run a retro/postmortem, capture lessons, or after a session with notable corrections or repeated mistakes.
effort: medium
allowed-tools: Read, Edit, Grep, Glob, Task
user-invocable: true
---

# Reflect - Session Self-Improvement

Reflect on the **current session** and propose durable, root-cause fixes to the project's
instruction surface (`CLAUDE.md`, `.claude/rules/*`, `.claude/skills/*`) so the mistakes,
misunderstandings, or ambiguous instructions that occurred don't recur.

Bias toward the opposite of a point fix: when something went wrong, the interesting output
is not "fix this file" but **"which instruction doc was ambiguous / missing / mis-scoped
such that a careful agent got it wrong — and how should that doc be reworded?"**

This is deliberately different from `revise-claude-md`:
- **Signal philosophy**: anchored on **externally-observable failure signals** (corrections,
  doc-misreads, failing commands, loops) — never open-ended "what could I have done better"
  introspection. Unaided self-critique of otherwise-correct work degrades quality; don't do it.
- **Target surface**: the full instruction surface (`CLAUDE.md` **+ rules + skills**), not
  just `CLAUDE.md`.
- **Fix type**: biased toward **editing the ambiguous line that misled you**, not just
  appending newly-discovered commands/gotchas.

## Step 1 — Detect

Scan the in-context conversation for **observable** failure/friction signals only:

- **Explicit user correction/redirect** — "no, do X instead", "actually…", "that's not what
  I meant", "why did you…", reverting a decision. Highest-precision signal.
- **Ambiguous instruction that misled** — a rule/CLAUDE.md/skill line was followed literally
  but wrongly; the guidance admitted a wrong reading.
- **Tool/test/build/lint failure caused by you** — non-zero exits, failing typecheck/lint/
  test/build traceable to your own change.
- **Loop / repeated retry** — you tried the same thing multiple times, thrashed, or went in
  circles before it worked.
- **Revert** — `git revert` / `git checkout --` / undo of your own work.

For each signal found, extract an **evidence bundle**: the exact quoted turn(s) or command(s)
that prove it happened.

**Hard boundary**: only act on observable failures. Never invent a signal from "my correct
work could have been more elegant" — that is the documented degradation regime for unaided
self-correction. If you find no signals, say so and stop — do not manufacture one.

## Step 2 — Investigate (fan-out, one subagent per signal, no cap)

For each signal from Step 1, spawn one `Task` subagent (fresh context, no bias toward
defending your own prior actions) with this exact prompt template, substituting the evidence:

```
You are investigating ONE thing that went wrong in a coding session, to decide whether a
project instruction document should be durably fixed so it doesn't happen again.

EVIDENCE (the receipt — what was observed):
<quoted turns / failing commands / the doc line that misled>

Your job:
1. ROOT CAUSE — dig through the repo's instruction docs (CLAUDE.md at root + apps/*,
   .claude/rules/*.md, .claude/skills/*) AND the codebase, by actually reading/grepping them —
   never assert what a file contains from memory. Determine WHY this happened. Was an
   instruction ambiguous, wrong, missing, or mis-placed? Quote the exact line(s).
   When verifying a claim about "how this codebase does X" via grep, don't stop at the first
   pattern that returns matches — try at least one broader/alternate phrasing (different
   modifier keywords, multi-line signatures, etc.) before treating the count as settled. If
   your first and second searches disagree meaningfully, say so in your root-cause writeup
   rather than picking whichever number you found first.
2. RUN ALL FOUR GATES — a durable fix is warranted ONLY IF:
   (a) doc-level root cause — there is a real line to edit/add;
   (b) likely to recur / generalizable — and scope the fix to its context, not "always X";
   (c) grounded — you can cite the evidence above, from a search broad enough to trust;
   (d) not already covered / not contradictory — search existing docs first; if duplicate,
       recommend reinforce/relocate; if conflicting, surface the conflict instead of adding.
3. OUTPUT one of:
   - PROPOSAL: { target_file, root_cause, exact diff (minimal reword/add), why (failure mode
     as stated reason) }
   - NO_DOC_CHANGE: point-fix only / one-off slip — nothing durable to change.
   - FLAG_ONLY: root cause is the user's prompt being ambiguous, or an uneditable harness
     skill — describe the observation; do NOT propose an edit.

Do not propose edits based on your opinion that correct work was suboptimal. Only act on the
observable failure in the evidence. Prefer the smallest doc change that removes the ambiguity.
```

## Step 3 — Synthesize

Collect all subagent outputs. Dedup `PROPOSAL`s that target the same doc line (merge into
one). Order the remaining proposals by severity: user corrections > loops/reverts > failing
commands > lint.

## Step 4 — Present (inline, per-item)

For each proposal, present in chat and wait for the user's decision before moving to the next:

```
━━ Proposal N/M ━━
SIGNAL:     <what went wrong>
EVIDENCE:   <transcript receipt — quoted>
ROOT CAUSE: <from investigator subagent>
TARGET:     <file path>
DIFF:
   - <old line>
   + <new line>
→ approve / edit / skip
```

- **approve** → apply immediately via `Edit`.
- **edit** → let the user redirect the wording/target, then apply.
- **skip** → do not apply; move on.

After all proposals, show a tail section:

```
FLAG-ONLY observations (no edit made): <one line each, from FLAG_ONLY outputs>
Dropped as noise (N): <one-line list of NO_DOC_CHANGE signals, so nothing is silently truncated>
```

## Known limitations (v0)

- Detection (Step 1) is done by this same agent from in-context conversation — it can miss
  its own blind spots and loses anything before a context compaction.
- No cap on subagent fan-out — a session with many signals spawns many subagents.
- Repo-committed docs only — does not touch global `~/.claude` or Auto Memory, even when a
  lesson is really about agent behavior rather than this codebase.
- No cross-session reinforcement/decay — each run is independent; it won't notice a rule
  that keeps getting hit across multiple sessions.

## Scope

$ARGUMENTS

If no scope is provided, reflect on the entire current session.
