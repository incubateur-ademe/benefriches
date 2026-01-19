# Feature Planning

Create a plan in `specs/<current-timestamp>-<feature-name>.md` for the `Feature` below.

## Instructions

1. **Declare scope first** - Determine if this is API-only, Web-only, Full-stack, or Shared
2. **Load only relevant context** based on scope:
   - API: `<root>/.claude/context/api/00-overview.md` + specific patterns needed
   - Web: `<root>/.claude/context/web/00-overview.md` + specific patterns needed
   - Full-stack: Both overviews + specific patterns as needed
3. **Explore targeted directories** - Don't explore everything:
   - API: `<root>/apps/api/src/[relevant-module]/`
   - Web: `<root>/apps/web/src/features/[relevant-feature]/`
   - Shared: `<root>/packages/shared/src/`
4. **Testing principles** - Each test should verify a distinct behavior:
   - Ask: "If test A passes, would test B always pass?" → If yes, test B is redundant
   - Ask: "What unique failure mode does this test catch?"
   - Avoid redundant tests (e.g., "response validation" covered by happy path)
5. Follow existing patterns. Report new library needs in Notes.

## Plan Format

```md
# Feature: <name>

## Feature overview
<describe the feature in detail, including its purpose and value to users. >
<How does the solution work? 2-3 sentences.>

## User Story
As a <user type>, I want to <goal> so that <benefit>.

## Scope
- [ ] API-only
- [ ] Web-only
- [ ] Full-stack
- [ ] Shared package

## Solution Statement
<describe the proposed solution approach and how it solves the problem>

## Relevant Files
Use these files to implement the feature:

<find and list the files that are relevant to the feature describe why they are relevant in bullet points. If there are new files that need to be created to implement the feature, list them in an h3 'New Files' section.>

## Step by Step Tasks
<list step by step tasks as h3 headers plus bullet points. use as many h3 headers as needed to implement the feature. Order matters, start with the foundational shared changes required then move on to the specific implementation. Include creating tests throughout the implementation process. Your last step should be running the `Validation Commands` to validate the feature works correctly with zero regressions.>

## Acceptance Criteria
<list specific, measurable criteria that must be met for the feature to be considered complete>

## Testing Strategy

### Unit Tests
<describe unit tests needed - each should test a distinct behavior>

### Integration Tests
<describe integration tests needed - typically: happy path, error cases, edge cases>

### Edge Cases
<list edge cases that need to be tested - only if they catch distinct failure modes>


## Validation Commands
<Specific commands to validate with 100% confidence the feature is implemented with zero regressions. Include commands to test the feature end-to-end. Start with the most specific commands (like running test on a file) and end with the broader ones (like running all tests for the codebase).>

## Notes
<Optional: list any additional notes, future considerations, or context that are relevant to the feature that will be helpful to the developer>
```

## Feature
$ARGUMENTS
