---
paths:
  - "apps/**/*.spec.ts"
  - "apps/**/*.spec.tsx"
  - "apps/**/*.integration-spec.ts"
  - "packages/**/*.spec.ts"
---

# Test design

How we design tests: what to test, how to structure it, where it lives. Runners and helpers are per app: node:test + `node:assert/strict` in api and shared (api mechanics: [api/api-testing.md](api/api-testing.md)), Vitest + Testing Library in web (the Tests section of [apps/web/AGENTS.md](../../apps/web/AGENTS.md)).

## Plan tests as Arrange / Act / Assert

Before implementing, list each test as **Arrange / Act / Assert** bullets, not a one-line description: that is the format we review coverage in.

- Use the real builder and API calls and exact identifiers (action names, step ids, expected values), never a paraphrase.
- Tag each item `(existing, keep)`, `(existing, rename only)`, `(NEW)` or `(NEW, regression guard)`, and list the existing tests that stay unchanged so the scope is clear.

## Test behaviour through the public surface

A test fails when behaviour breaks and stays green through a behaviour-preserving refactor.

- Assert the public outcome: return value, published event, rendered output, persisted state. Never private methods, internal fields or intermediate state.
- Drive and observe through the public surface: query the UI by role, label or text (not CSS classes, test ids or DOM structure); assert a use case's `Result` and published events, not its helpers; read a selector's output, not the reducer's state shape.
- Prefer real collaborators and our InMemory fakes over ad-hoc mocks. Assert an interaction ("was called with") only when the call is the behaviour: an event published, a gateway notified.

## One behaviour per test

- Each test guards one behaviour and is named after it, not after the method it calls, so a failure says what broke.
- Drop test B when test A passing guarantees B passes; don't re-assert happy-path validation that a dedicated test covers.
- Don't test states that upstream invariants rule out. A `?? <neutral>` that only satisfies a `T | undefined` type at a boundary has no impossible branch to cover.

## Keep each test self-contained

A test reads top to bottom with everything it depends on visible. A little duplication beats a shared abstraction that hides what the test exercises.

- Set the preconditions the test relies on in its own setup, even when the builder default already has them: `.withSiteData({ hasContaminatedSoils: true, contaminatedSoilSurface: 2000 })`.
- Instantiate the subject under test inside each `it()`, not in `beforeEach()`, and share no mutable variables across nested `describe`/`beforeEach` scopes.
- No `if` or loop around assertions. To parameterise, loop with `for..of` at the `describe` level and generate one named `it` per case (``it(`advances for ${phase} phase`, …)``), so a failure names the input that broke.
- No real clock, `sleep`, network or random ids: fixed ids and dates from the deterministic providers, and nothing leaks from one test to the next.

## Assert the full shape

- Assert the complete value in one assertion, so extra and missing fields fail: `expect(actual).toEqual({…})` in web, `assert.deepStrictEqual(actual, {…})` in api and shared. Partial matchers (`toMatchObject`, `assert.partialDeepStrictEqual`) silently accept extra keys.
- Cover the success path and every distinct failure path.

## Where tests live

- A test sits next to the unit it guards, not in a grab-bag spec. A wizard step's behaviour (forward `stepCompletionRequested` and back `previousStepRequested`) goes in that step's own `*.step.spec.ts`; only engine-level cases (first step, navigation as a mechanism) go in the shared action specs such as `previousStepRequested.action.spec.ts`.
- Unit, integration and e2e placement is in the root [AGENTS.md](../../AGENTS.md). Put exhaustive cases in unit and integration tests; e2e covers 2–4 common nominal flows, not edge cases or permutations.
- Coverage finds untested code; it isn't a target. A test written only to move the number rarely catches a bug.
