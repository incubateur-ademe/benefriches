# shared/core/wizard-form — generic wizard-form engine

This is the **generic engine only** (ADR-0015): the step algorithm + handler contract, generic over
`<StepId, TAnswers>`. It has no slice, no reducer, and **zero domain** — no `project`/`urban`/`site`
tokens, and it imports nothing from `features/*`. That boundary is machine-enforced by the oxlint rule
`architecture-boundaries/no-cross-layer-import` (`shared/** -> features/**`, `error`). If you feel the
need to reach into a feature from here, the abstraction is wrong — the domain belongs in the features.

To understand the whole mechanism or add/extend a wizard form, use the **`wizard-form` skill**
(`.claude/skills/wizard-form/`). Decision record: `docs/adr/0015-extract-wizard-form-engine-via-injected-lens.md`.
