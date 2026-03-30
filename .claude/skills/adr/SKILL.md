---
name: adr
description: Evaluate whether session changes warrant an Architecture Decision Record, and create one if justified. Use when significant architectural decisions have been made, new patterns introduced, or after major refactors.
effort: medium
allowed-tools: Bash, Read, Write, Glob
user-invocable: true
---

# ADR - Architecture Decision Record

Evaluate whether recent changes warrant an ADR and create one if justified.

## Instructions

### 1. Analyze Session Changes

Run `git diff` to see uncommitted changes. If no uncommitted changes, run `git diff HEAD~1` to review the last commit.

If a scope is provided via arguments (e.g., a commit range or file path), use that instead.

### 2. Determine if an ADR is Warranted

An ADR is justified when:

- A **significant architectural decision** was made (new pattern, new abstraction, structuring technical choice)
- The decision **affects the code structure in a durable manner**
- There were **alternatives considered** that are useful to document
- A **new library or tool** was introduced that replaces or complements existing ones
- A **convention or pattern was established** that future code should follow

An ADR is **NOT** justified for:

- Routine feature additions following existing patterns
- Bug fixes
- Minor refactoring that doesn't change architecture
- Dependency updates (unless a major migration)
- Configuration changes

### 3. If Not Warranted

Report to the user:

```
No ADR needed - changes follow existing patterns without introducing new architectural decisions.
```

### 4. If Warranted

#### 4a. Determine the next ADR number

List existing ADR files to find the next sequential number:

```bash
ls docs/adr/
```

#### 4b. Read the template

Read the ADR template at `docs/adr/0000-template.md`.

#### 4c. Draft the ADR

Write the ADR following the template with these rules:

- **Title**: Concise decision statement in imperative form (e.g., "Use Zod for runtime validation")
- **Date**: Today's date
- **Status**: `Accepted`
- **Context**: Why did this decision come up? What problem were we solving?
- **Decision**: What was decided, concisely
- **Options Considered**: At least 2 options with honest pros/cons. Only include options that were actually considered, don't invent fictional alternatives.
- **Consequences**: Real positive and negative impacts
- **Links**: Reference related ADRs if applicable

#### 4d. Present for validation

Show the full draft to the user and ask for feedback before creating the file.

#### 4e. Create the file

Once validated, write the file to `docs/adr/NNNN-kebab-case-title.md`.

#### 4f. Update the index

Add the new ADR to the index table in `docs/adr/README.md`.

## Scope

$ARGUMENTS

If no scope provided, analyze all uncommitted changes or the last commit.
