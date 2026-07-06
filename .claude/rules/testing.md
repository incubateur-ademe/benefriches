---
paths:
  - "apps/**/*.spec.ts"
  - "apps/**/*.integration-spec.ts"
  - "packages/**/*.spec.ts"
---

# Test Design

> **How we design tests** — what to test, how to structure it, and where it lives. This is about test *design*; for runner/assertion mechanics see the API-specific rules linked at the bottom.

## 1. Plan tests as Arrange / Act / Assert before writing them

Before implementing, list each test as explicit **Arrange / Act / Assert** bullets — not a one-line description. This is the format we review and confirm coverage in.

- One bullet each for **Arrange**, **Act**, **Assert**.
- Use real API/builder calls and exact identifiers (action names, step IDs, expected values) — never paraphrase.
- Tag each item: `(existing, keep)`, `(existing, rename only)`, `(NEW)`, `(NEW, regression guard)`.
- Explicitly note existing tests that stay unchanged, so scope is clear.

## 2. Test observable behaviour, not implementation

A test must be **sensitive to behaviour changes and insensitive to structure changes**: if the code is refactored but behaves the same, the test stays green; if the behaviour breaks, the test fails. The more a test resembles the way the code is really used, the more confidence it gives.

- Assert the **public outcome**: return value, emitted event, rendered output, persisted state — never private methods, internal fields, or intermediate state.
- Drive and observe through the **public surface**: query the UI by role/label/text (not CSS classes, test-ids, or DOM structure); assert a UseCase's `Result`/published events (not its private helpers); read a selector's output (not a reducer's internal shape).
- A test that knows *how* the code works rather than *what* it guarantees fails twice over: it breaks on harmless refactors (false alarm) **and** stays green when the feature is actually broken (false confidence). Couple tests to contracts, not to structure.

## 3. One behaviour per test, with an obvious failure

Each test guards **one behaviour**, and when it fails the cause should be obvious from the name and the single failing assertion — no debugging to find out what broke.

- Ask: *"If test A passes, would test B always pass?"* — if yes, test B is redundant; drop it.
- Ask: *"What unique failure mode does this test catch?"*
- Don't re-assert happy-path validation a dedicated test already covers.
- Name the test after the behaviour it guards, not the method it calls.

## 4. Keep each test self-contained and readable

A test should read top-to-bottom as one story, with everything it depends on visible inside it. Prefer a little duplication over a shared abstraction that hides what the test actually exercises.

- Make preconditions **explicit in the test's own setup** rather than relying on shared mock/builder defaults — set the relevant fields even when the default already has them, e.g. `.withSiteData({ hasContaminatedSoils: true, contaminatedSoilSurface: 2000 })`, so intent is visible without hunting through fixtures.
- Instantiate the subject under test inside each `it()`, not in `beforeEach()`.
- Avoid deep `describe`/`beforeEach` nesting with mutable shared variables — the reader shouldn't have to trace state across scopes to understand a test.
- No branching in tests (`if`/loops around assertions): a test should run the same way every time. Parameterise with a `for..of` over explicit cases instead.
- When parameterising with `for..of`, loop at the `describe`/`it` level to generate one named `it` per case — never loop *inside* a single `it()` around the assertions. A loop-inside-`it()` fails rule 3's "obvious failure" guarantee: if one case breaks, the test name doesn't say which, and you have to read the diff to find out. Generate the test name from the case (e.g. `` it(`advances for ${phase} phase`, ...) ``) so a failure points straight at the input that broke.

## 5. Assert the full shape

- Assert the **complete shape** in one assertion, not a partial match — catching extra or missing fields is the point. Use the exhaustive matcher for your runner: `expect(actual).toEqual({...})` in web (Vitest), `assert.deepStrictEqual(actual, {...})` / `assertShapeEquals(...)` in API and shared (node:test). Avoid partial matchers (`toMatchObject`, `assert.partialDeepStrictEqual`) for shape checks — they silently allow extra keys.
- Use fixed IDs and dates (deterministic providers/generators) so the expected shape is stable. No `Date.now()` / random values.
- Test the success path **and** every distinct failure path.

> **Runners**: web (`apps/web`) uses **Vitest** (`expect`); API (`apps/api`) and the shared package use **node:test** + `node:assert/strict`. For node:test mechanics see the [API unit-testing](api/api-unit-testing.md) and [integration-testing](api/api-integration-testing.md) rules.

## 6. Prefer real collaborators; mock sparingly

Reach for a test double only when the real collaborator is slow, non-deterministic, or awkward to construct (network, clock, external service). Prefer our **InMemory fakes** over ad-hoc mocks — they exercise real logic and stay closer to production.

- Assert on **outcomes** (return value, resulting state, emitted event), not on **interactions** ("was called with X"). Interaction assertions verify how the code is wired, not what it does — they pass when the code is broken and break when it is refactored.
- Reserve spy/interaction assertions for cases where the call *is* the observable behaviour (an event was published, a gateway was notified). Even then, assert the effect, not the internal mechanics.

## 7. Test the real path, never impossible states

Don't write tests for states that upstream invariants guarantee can't occur in production.

- If the code uses `?? <neutral>` to satisfy a `T | undefined` type at a boundary (rather than branching on an impossible case), there is no impossible-case branch to test.
- Cover the production path; a test for a dead defensive branch just ossifies dead code.

## 8. Keep tests fast, isolated, and self-validating

- **Fast**: a slow suite gets run less, so it catches bugs later. Keep unit tests off I/O; push anything that needs real I/O to the integration layer.
- **Isolated**: order-independent, no shared mutable state between tests. A test sets up everything it needs and leaks nothing to the next.
- **Deterministic**: same input, same result — wrap the clock, never `sleep`, don't touch the real network. A flaky test is worse than no test: once people ignore a red build, the suite stops protecting anyone.
- **Self-validating**: a boolean pass/fail. Never require reading logs or eyeballing output to know whether a test passed.

## 9. Colocate tests with the code they guard

A test lives next to the specific unit it exercises — not in a shared grab-bag spec.

- A test for **one step's** behaviour (forward `stepCompletionRequested` *and* backward `previousStepRequested`) belongs in that step's colocated `steps/<chapter>/<step>.step.spec.ts`, kept together.
- Only **generic framework** tests (first-step handling, round-trip navigation as a mechanism, cross-cutting edge cases) belong in the shared action specs.

## 10. Match the test type to the layer

| Test type | File | Verifies | I/O |
|-----------|------|----------|-----|
| **Unit** | `*.spec.ts` (next to code) | business/domain logic in isolation | none (InMemory/fakes) |
| **Integration** | `*.integration-spec.ts` (in `adapters/`) | real DB / real network | testcontainers |
| **E2E** | `*.spec.ts` in `e2e-tests/tests/` | full user flows | running stack |

- Put **exhaustive** coverage in unit/integration tests.
- **E2E covers 2–4 common nominal flows only** — not edge cases or exhaustive permutations.
- Coverage is a tool for finding untested code, not a target. Don't chase 100% — a test written only to move the number rarely catches a real bug.

## Related

- **API unit-testing mechanics** (node:test syntax, InMemory, Result pattern, event publishing): [api/api-unit-testing.md](api/api-unit-testing.md)
- **API integration-testing mechanics** (testcontainers, supertest, `assertShapeEquals`): [api/api-integration-testing.md](api/api-integration-testing.md)
</content>
