import {
  DevelopmentPlanInstallationExpenses,
  ReinstatementExpense,
  ReinstatementExpensePurpose,
  sumListWithKey,
} from "shared";
import { describe, it, expect, beforeEach } from "vitest";

import { Schedule } from "../../project.types";
import { creationProjectFormActions } from "../urbanProject.actions";
import { mockSiteData } from "./_siteData.mock";
import { createTestStore } from "./_testStoreHelpers";

const { navigateToStep, requestStepCompletion } = creationProjectFormActions;

describe("navigateToStep action", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe("Basic navigateToStep functionality", () => {
    it("should not change state when loaded step without existing answers", () => {
      const initialSteps = store.getState().projectCreation.urbanProject.steps;
      expect(Object.keys(initialSteps)).toHaveLength(0);

      // étape qui n'a pas de valeurs par défaut
      store.dispatch(navigateToStep({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION" }));

      expect(
        store.getState().projectCreation.urbanProject.steps
          .URBAN_PROJECT_SPACES_CATEGORIES_SELECTION,
      ).toBeUndefined();
    });

    it("should generate default answers for steps that have them", () => {
      // étape qui génère des valeurs par défaut
      store.dispatch(navigateToStep({ stepId: "URBAN_PROJECT_NAMING" }));

      const step = store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_NAMING;
      expect(step?.defaultValues).toEqual({ name: expect.any(String) as string });
    });

    it("should generate default expenses for installation step", () => {
      store.dispatch(navigateToStep({ stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION" }));

      const steps = store.getState().projectCreation.urbanProject.steps;
      expect(steps.URBAN_PROJECT_EXPENSES_INSTALLATION).toBeDefined();
      expect(steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.completed).toEqual(false);
      expect(steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.payload).toBeUndefined();
      expect(steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.defaultValues).toMatchObject({
        installationExpenses: expect.arrayContaining([
          expect.objectContaining({
            purpose: "development_works",
            amount: expect.any(Number) as number,
          }),
          expect.objectContaining({
            purpose: "technical_studies",
            amount: expect.any(Number) as number,
          }),
          expect.objectContaining({
            purpose: "other",
            amount: expect.any(Number) as number,
          }),
        ]) as DevelopmentPlanInstallationExpenses[],
      });
    });

    it("should generate default schedule when loading schedule projection", () => {
      store.dispatch(navigateToStep({ stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION" }));

      const steps = store.getState().projectCreation.urbanProject.steps;
      expect(steps.URBAN_PROJECT_SCHEDULE_PROJECTION).toEqual({
        completed: false,
        payload: undefined,
        defaultValues: {
          installationSchedule: expect.objectContaining({
            startDate: expect.any(String) as string,
            endDate: expect.any(String) as string,
          }) as Schedule,
          firstYearOfOperation: expect.any(Number) as number,
          // site is FRICHE
          reinstatementSchedule: expect.objectContaining({
            startDate: expect.any(String) as string,
            endDate: expect.any(String) as string,
          }) as Schedule,
        },
      });
    });

    it("should generate different schedule for non-FRICHE site", () => {
      const storeNonFriche = createTestStore({
        siteData: { ...mockSiteData, nature: "AGRICULTURAL_OPERATION" },
      });

      storeNonFriche.dispatch(navigateToStep({ stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION" }));

      const steps = storeNonFriche.getState().projectCreation.urbanProject.steps;
      expect(
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.reinstatementSchedule,
      ).toBeUndefined();
      expect(
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.defaultValues?.installationSchedule,
      ).toBeDefined();
    });

    it("should not generate defaults when default answers already exist", () => {
      const storeWithExistingAnswer = createTestStore({
        steps: {
          URBAN_PROJECT_NAMING: {
            completed: true,
            payload: { name: "Nom existant" },
            defaultValues: { name: "Projet PV" },
          },
        },
      });

      storeWithExistingAnswer.dispatch(navigateToStep({ stepId: "URBAN_PROJECT_NAMING" }));

      const steps = storeWithExistingAnswer.getState().projectCreation.urbanProject.steps;

      expect(steps.URBAN_PROJECT_NAMING).toEqual({
        completed: true,
        payload: { name: "Nom existant" },
        defaultValues: { name: "Projet PV" },
      });
    });

    it("should handle complex default values correctly for installation expenses", () => {
      store.dispatch(navigateToStep({ stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION" }));

      const afterLoadStep =
        store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_EXPENSES_INSTALLATION;
      const defaultExpenses = afterLoadStep?.defaultValues?.installationExpenses;

      // same values than default
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
          answers: { installationExpenses: defaultExpenses },
        }),
      );

      const afterCompleteStep =
        store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_EXPENSES_INSTALLATION;
      expect(afterCompleteStep).toEqual({
        completed: true,
        payload: { installationExpenses: defaultExpenses },
        defaultValues: { installationExpenses: defaultExpenses },
      });
    });

    it("should handle reinstatement expenses with soil distribution context", () => {
      const storeWithContext = createTestStore({
        steps: {
          URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesCategoriesDistribution: {
                LIVING_AND_ACTIVITY_SPACES: 5000,
                PUBLIC_SPACES: 5000,
              },
            },
          },
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: {
              livingAndActivitySpacesDistribution: {
                BUILDINGS: 2000,
                IMPERMEABLE_SURFACE: 1500,
                PERMEABLE_SURFACE: 1000,
                PRIVATE_GREEN_SPACES: 500,
              },
            },
          },
          URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: {
            completed: true,
            payload: {
              publicSpacesDistribution: {
                IMPERMEABLE_SURFACE: 2500,
                PERMEABLE_SURFACE: 1500,
                GRASS_COVERED_SURFACE: 1000,
              },
            },
          },
        },
      });

      storeWithContext.dispatch(navigateToStep({ stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT" }));

      const afterLoadSteps = storeWithContext.getState().projectCreation.urbanProject.steps;

      expect(afterLoadSteps.URBAN_PROJECT_EXPENSES_REINSTATEMENT).toEqual({
        payload: undefined,
        completed: false,
        defaultValues: {
          reinstatementExpenses: expect.arrayContaining([
            expect.objectContaining({
              purpose: expect.any(String) as ReinstatementExpensePurpose,
              amount: expect.any(Number) as number,
            }),
          ]) as ReinstatementExpense[],
        },
      });
      const expenses =
        afterLoadSteps.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.defaultValues?.reinstatementExpenses ??
        [];
      expect(sumListWithKey(expenses, "amount")).toBeGreaterThan(0);
    });
  });

  describe("LoadStep edge cases", () => {
    it.each([
      "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
      "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
      "URBAN_PROJECT_PROJECT_PHASE",
    ] as const)("should handle navigateToStep for steps without default logic", (stepId) => {
      const testStore = createTestStore();
      testStore.dispatch(navigateToStep({ stepId: stepId }));

      const steps = testStore.getState().projectCreation.urbanProject.steps;
      expect(steps[stepId]).toBeUndefined();
    });
  });
});
