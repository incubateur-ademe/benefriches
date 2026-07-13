import { describe, it, expect, vi, beforeEach } from "vitest";

import type { ProjectFormState } from "../../projectForm.reducer";
import type { StepInvalidationRule } from "../step-handlers/stepHandler.type";
import type { AnswerStepId, AnswersByStep } from "../urbanProjectSteps";

// Mock the step handler registry — both exports share the same mutable object
// so that populating one is immediately visible to the other.
vi.mock("../step-handlers/stepHandlerRegistry", () => {
  const registry = {};
  return { answerStepHandlers: registry, stepHandlerRegistry: registry };
});

// Import after mock setup
const { stepHandlerRegistry } = await import("../step-handlers/stepHandlerRegistry");
const { computeStepChanges } = await import("./completeStep");

function makeHandler<T extends AnswerStepId>(
  stepId: T,
  options: {
    getNextStepId?: () => string;
    getDependencyRules?: (context: unknown, answers: AnswersByStep[T]) => StepInvalidationRule[];
    getShortcut?: (
      context: unknown,
      answers: AnswersByStep[T],
    ) => { complete: { stepId: AnswerStepId; answers: unknown }[]; next: string } | undefined;
    updateAnswersMiddleware?: (context: unknown, answers: AnswersByStep[T]) => AnswersByStep[T];
  } = {},
) {
  return {
    stepId,
    getNextStepId: options.getNextStepId ?? (() => "URBAN_PROJECT_FINAL_SUMMARY"),
    ...options,
  };
}

function makeState(steps: ProjectFormState["urbanProject"]["steps"] = {}): ProjectFormState {
  return {
    siteData: undefined,
    siteDataLoadingState: "idle",
    siteRelatedLocalAuthorities: { loadingState: "idle" },
    urbanProject: {
      currentStep: "URBAN_PROJECT_USES_SELECTION",
      saveState: "idle",
      siteResaleEstimationLoadingState: "idle",
      stepsSequence: [],
      firstSequenceStep: "URBAN_PROJECT_CREATE_MODE_SELECTION",
      steps,
    },
  } as unknown as ProjectFormState;
}

describe("computeStepChanges", () => {
  beforeEach(() => {
    // Clear registry between tests
    for (const key of Object.keys(stepHandlerRegistry)) {
      // eslint-disable-next-line typescript-eslint/no-dynamic-delete
      delete (stepHandlerRegistry as Record<string, unknown>)[key];
    }
  });

  it("should return dependency rules from the completed step", () => {
    const rules: StepInvalidationRule[] = [
      { stepId: "URBAN_PROJECT_NAMING", action: "invalidate" },
    ];

    Object.assign(stepHandlerRegistry, {
      URBAN_PROJECT_USES_SELECTION: makeHandler("URBAN_PROJECT_USES_SELECTION", {
        getDependencyRules: () => rules,
      }),
    });

    const state = makeState();
    const result = computeStepChanges(state, {
      stepId: "URBAN_PROJECT_USES_SELECTION",
      answers: { usesSelection: ["RESIDENTIAL"] },
    });

    expect(result.cascadingChanges).toEqual(rules);
  });

  it("should merge shortcut-completed step's dependency rules into cascading changes", () => {
    // Step A (uses selection) has:
    //   - dependency rules targeting step D (invalidate)
    //   - a shortcut that completes step B (public green spaces surface area)
    // Step B has:
    //   - dependency rules targeting step C (delete)
    //
    // Expected: cascading changes contain rules for both D and C

    Object.assign(stepHandlerRegistry, {
      URBAN_PROJECT_USES_SELECTION: makeHandler("URBAN_PROJECT_USES_SELECTION", {
        getDependencyRules: () => [
          { stepId: "URBAN_PROJECT_NAMING", action: "invalidate" as const },
        ],
        getShortcut: () => ({
          complete: [
            {
              stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA" as AnswerStepId,
              answers: { publicGreenSpacesSurfaceArea: 1000 },
            },
          ],
          next: "URBAN_PROJECT_SPACES_INTRODUCTION",
        }),
      }),
      URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: makeHandler(
        "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
        {
          getDependencyRules: () => [
            { stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION", action: "delete" as const },
          ],
        },
      ),
    });

    const state = makeState();
    const result = computeStepChanges(state, {
      stepId: "URBAN_PROJECT_USES_SELECTION",
      answers: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
    });

    expect(result.cascadingChanges).toEqual(
      expect.arrayContaining([
        { stepId: "URBAN_PROJECT_NAMING", action: "invalidate" },
        { stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION", action: "delete" },
      ]),
    );
    expect(result.cascadingChanges).toHaveLength(2);
  });

  it("should remove rules targeting shortcut-completed steps", () => {
    // Step A has dependency rule to invalidate step B
    // Step A also has a shortcut that completes step B
    // → The invalidation rule for B should be removed (B is now completed by shortcut)

    Object.assign(stepHandlerRegistry, {
      URBAN_PROJECT_USES_SELECTION: makeHandler("URBAN_PROJECT_USES_SELECTION", {
        getDependencyRules: () => [
          {
            stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
            action: "invalidate" as const,
          },
          { stepId: "URBAN_PROJECT_NAMING", action: "invalidate" as const },
        ],
        getShortcut: () => ({
          complete: [
            {
              stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA" as AnswerStepId,
              answers: { publicGreenSpacesSurfaceArea: 1000 },
            },
          ],
          next: "URBAN_PROJECT_SPACES_INTRODUCTION",
        }),
      }),
      URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: makeHandler(
        "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
      ),
    });

    const state = makeState();
    const result = computeStepChanges(state, {
      stepId: "URBAN_PROJECT_USES_SELECTION",
      answers: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
    });

    expect(result.cascadingChanges).toEqual([
      { stepId: "URBAN_PROJECT_NAMING", action: "invalidate" },
    ]);
  });

  it("should prefer shortcut step's rules when both target the same step", () => {
    // Step A invalidates step C
    // Shortcut completes step B, which deletes step C
    // → Step C should be "delete" (from shortcut's rule), not "invalidate"

    Object.assign(stepHandlerRegistry, {
      URBAN_PROJECT_USES_SELECTION: makeHandler("URBAN_PROJECT_USES_SELECTION", {
        getDependencyRules: () => [
          { stepId: "URBAN_PROJECT_NAMING", action: "invalidate" as const },
        ],
        getShortcut: () => ({
          complete: [
            {
              stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA" as AnswerStepId,
              answers: { publicGreenSpacesSurfaceArea: 1000 },
            },
          ],
          next: "URBAN_PROJECT_SPACES_INTRODUCTION",
        }),
      }),
      URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: makeHandler(
        "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
        {
          getDependencyRules: () => [{ stepId: "URBAN_PROJECT_NAMING", action: "delete" as const }],
        },
      ),
    });

    const state = makeState();
    const result = computeStepChanges(state, {
      stepId: "URBAN_PROJECT_USES_SELECTION",
      answers: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
    });

    expect(result.cascadingChanges).toEqual([{ stepId: "URBAN_PROJECT_NAMING", action: "delete" }]);
  });
});
