import { describe, it, expect } from "vitest";

import { ProjectCreationState } from "../../createProject.reducer";
import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { mockSiteData } from "./_siteData.mock";
import { createTestStore } from "./_testStoreHelpers";

const { confirmStepCompletion, requestStepCompletion } = creationProjectFormUrbanActions;

describe("urbanProject.reducer - confirmStepCompletion action", () => {
  describe("Changes answers to step already completed", () => {
    describe("Buildings-related changes", () => {
      it("should delete operating expenses when changing buildings resale to true", () => {
        const initialSteps = {
          URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
            completed: true,
            payload: {
              buildingsResalePlannedAfterDevelopment: false,
            },
          },
          URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
            completed: true,
            payload: {
              yearlyProjectedBuildingsOperationsExpenses: [
                { purpose: "maintenance", amount: 50000 },
              ],
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({ steps: initialSteps });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
            answers: { buildingsResalePlannedAfterDevelopment: true },
          }),
        );
        store.dispatch(confirmStepCompletion());

        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES).toEqual(
          undefined,
        );
      });
    });

    describe("Decontamination changes", () => {
      it("should recompute system generated reinstatement expenses when changing decontamination settings", () => {
        const initialSteps = {
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: {
              reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
            },
            defaultValues: {
              reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
            },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
            completed: true,
            payload: {
              decontaminationPlan: "partial",
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "none" },
          }),
        );
        store.dispatch(confirmStepCompletion());

        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.completed).toEqual(true);
        expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload).toEqual(
          stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.defaultValues,
        );
        expect(
          stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses?.find(
            (expense) => expense.purpose === "remediation",
          )?.amount,
        ).toEqual(0);
      });

      it("should not recompute user reinstatement expenses when changing decontamination settings", () => {
        const initialSteps = {
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: {
              reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
            },
            defaultValues: {
              reinstatementExpenses: [{ purpose: "remediation", amount: 50000 }],
            },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
            completed: true,
            payload: {
              decontaminationPlan: "partial",
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "none" },
          }),
        );
        store.dispatch(confirmStepCompletion());

        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.completed).toEqual(true);
        expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload).toEqual(
          initialSteps.URBAN_PROJECT_EXPENSES_REINSTATEMENT.payload,
        );
      });

      it('should automatically set decontamination surface area for "none" plan', () => {
        const store = createTestStore({
          currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          siteData: { ...mockSiteData, hasContaminatedSoils: true },
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "none" },
          }),
        );
        store.dispatch(confirmStepCompletion());
        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA).toEqual({
          completed: true,
          payload: { decontaminatedSurfaceArea: 0 },
        });
      });

      it('should automatically set decontamination surface area for "unknown" plan', () => {
        const contaminatedSoilSurface = 1000;
        const store = createTestStore({
          currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          siteData: {
            ...mockSiteData,
            hasContaminatedSoils: true,
            contaminatedSoilSurface,
          },
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "unknown" },
          }),
        );
        store.dispatch(confirmStepCompletion());

        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA).toEqual({
          completed: true,
          payload: { decontaminatedSurfaceArea: contaminatedSoilSurface * 0.25 },
        });
      });
    });
  });
});
