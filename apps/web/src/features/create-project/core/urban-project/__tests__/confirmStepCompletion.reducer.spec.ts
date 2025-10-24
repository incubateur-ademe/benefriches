import { describe, it, expect } from "vitest";

import { ProjectCreationState } from "../../createProject.reducer";
import { creationProjectFormActions } from "../urbanProject.actions";
import { mockSiteData } from "./_siteData.mock";
import { createTestStore } from "./_testStoreHelpers";

const { confirmStepCompletion, requestStepCompletion } = creationProjectFormActions;

describe("urbanProject.reducer - confirmStepCompletion action", () => {
  describe("Changes answers to step already completed", () => {
    describe("Space categories selection changes", () => {
      it("should delete dependent answers when removing LIVING_AND_ACTIVITY_SPACES category", () => {
        const initialSteps = {
          URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
            completed: true,
            payload: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"] },
          },
          URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesCategoriesDistribution: {
                LIVING_AND_ACTIVITY_SPACES: 5000,
                GREEN_SPACES: 3000,
              },
            },
          },
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: {
              livingAndActivitySpacesDistribution: {
                BUILDINGS: 2000,
                PRIVATE_GREEN_SPACES: 3000,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              buildingsFloorSurfaceArea: 4000,
            },
          },
          URBAN_PROJECT_BUILDINGS_USE_SELECTION: {
            completed: true,
            payload: {
              buildingsUsesSelection: ["RESIDENTIAL", "LOCAL_STORE"],
            },
          },
          URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
            completed: true,
            payload: {
              buildingsUsesDistribution: { RESIDENTIAL: 3000, LOCAL_STORE: 1000 },
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
        });

        // Modification : suppression de LIVING_AND_ACTIVITY_SPACES
        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["GREEN_SPACES"] },
          }),
        );

        const intermediateState = store.getState().projectCreation.urbanProject;
        expect(intermediateState.pendingStepCompletion?.showAlert).toBe(true);
        expect(intermediateState.pendingStepCompletion?.changes).toEqual({
          cascadingChanges: [
            {
              stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
              action: "delete",
            },
            {
              stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
              action: "delete",
            },
            {
              stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",
              action: "delete",
            },
            {
              stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
              action: "delete",
            },
          ],

          navigationTarget: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
          payload: {
            answers: {
              spacesCategories: ["GREEN_SPACES"],
            },
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          },
          shortcutComplete: [
            {
              answers: {
                spacesCategoriesDistribution: {
                  GREEN_SPACES: 10000,
                },
              },
              stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
            },
          ],
        });

        store.dispatch(confirmStepCompletion());

        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(store.getState().projectCreation.urbanProject.currentStep).toEqual(
          "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
        );
        expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual(
          undefined,
        );

        expect(stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA).toEqual({
          completed: true,
          payload: {
            spacesCategoriesDistribution: {
              GREEN_SPACES: store.getState().projectCreation.siteData?.surfaceArea,
            },
          },
        });
        expect(stepsState.URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION).toEqual(
          undefined,
        );
        expect(stepsState.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA).toEqual(undefined);
        expect(stepsState.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION).toEqual(undefined);
      });

      it("should delete green spaces answers when removing GREEN_SPACES category", () => {
        const initialSteps = {
          URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
            completed: true,
            payload: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "GREEN_SPACES"] },
          },
          URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: {
            completed: true,
            payload: {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 2000, TREE_FILLED_SPACE: 1000 },
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
          }),
        );
        store.dispatch(confirmStepCompletion());
        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION).toEqual(undefined);
      });

      it("should partially recompute user reinstatement expenses when changing soils distribution", () => {
        const initialSteps = {
          URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
            completed: true,
            payload: {
              spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
            },
          },
          URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesCategoriesDistribution: {
                LIVING_AND_ACTIVITY_SPACES: 10000,
              },
            },
          },
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: {
              livingAndActivitySpacesDistribution: {
                IMPERMEABLE_SURFACE: 2000,
                PERMEABLE_SURFACE: 8000,
              },
            },
          },
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: {
              reinstatementExpenses: [
                { purpose: "remediation", amount: 6600 },
                { purpose: "asbestos_removal", amount: 10500 },
                { purpose: "deimpermeabilization", amount: 20000 },
                { purpose: "demolition", amount: 0 },
              ],
            },
            defaultValues: {
              reinstatementExpenses: [
                { purpose: "remediation", amount: 6600 },
                { purpose: "deimpermeabilization", amount: 20000 },
                { purpose: "demolition", amount: 0 },
              ],
            },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
            completed: true,
            payload: {
              decontaminationPlan: "partial",
            },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
            completed: true,
            payload: {
              decontaminatedSurfaceArea: 1000,
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            answers: {
              livingAndActivitySpacesDistribution: {
                PERMEABLE_SURFACE: 5000,
                PRIVATE_GREEN_SPACES: 5000,
              },
            },
          }),
        );
        store.dispatch(confirmStepCompletion());

        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.completed).toEqual(true);
        expect(
          stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses,
        ).toEqual([
          { purpose: "remediation", amount: 66000 },
          { purpose: "asbestos_removal", amount: 10500 },
          { purpose: "deimpermeabilization", amount: 50000 },
          { purpose: "demolition", amount: 150000 },
        ]);
      });
    });

    describe("Buildings-related changes", () => {
      it("should delete building steps when removing buildings from residential spaces", () => {
        const initialSteps = {
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: {
              livingAndActivitySpacesDistribution: {
                BUILDINGS: 2000,
                PRIVATE_GREEN_SPACES: 3000,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              buildingsFloorSurfaceArea: 4000,
            },
          },
          URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
            completed: true,
            payload: {
              buildingsUsesDistribution: { RESIDENTIAL: 3000, LOCAL_STORE: 1000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
            completed: true,
            payload: {
              buildingsResalePlannedAfterDevelopment: false,
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({ steps: initialSteps });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            answers: {
              livingAndActivitySpacesDistribution: {
                PRIVATE_GREEN_SPACES: 5000,
              },
            },
          }),
        );
        store.dispatch(confirmStepCompletion());
        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA).toEqual(undefined);

        expect(stepsState.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION).toEqual(undefined);

        expect(stepsState.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION).toEqual(undefined);
      });

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

    describe("Site resale changes", () => {
      it("should delete site resale revenue when changing resale plan to false", () => {
        const initialSteps = {
          URBAN_PROJECT_SITE_RESALE_SELECTION: {
            completed: true,
            payload: {
              siteResalePlannedAfterDevelopment: true,
            },
          },
          URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
            completed: true,
            payload: {
              siteResaleExpectedSellingPrice: 100000,
              siteResaleExpectedPropertyTransferDuties: 5000,
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
          currentStep: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
            answers: { siteResalePlannedAfterDevelopment: false },
          }),
        );
        store.dispatch(confirmStepCompletion());
        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE).toEqual(undefined);
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

      it("should partially recompute user reinstatement expenses when changing decontamination settings", () => {
        const initialSteps = {
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: {
              reinstatementExpenses: [
                { purpose: "remediation", amount: 50000 },
                { purpose: "asbestos_removal", amount: 10500 },
                { purpose: "deimpermeabilization", amount: 0 },
              ],
            },
            defaultValues: {
              reinstatementExpenses: [
                { purpose: "remediation", amount: 50000 },
                { purpose: "deimpermeabilization", amount: 10000 },
              ],
            },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
            completed: true,
            payload: {
              decontaminationPlan: "partial",
            },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
            completed: true,
            payload: {
              decontaminatedSurfaceArea: 1000,
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
        expect(
          stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses,
        ).toEqual([
          { purpose: "remediation", amount: 0 },
          { purpose: "asbestos_removal", amount: 10500 },
          { purpose: "deimpermeabilization", amount: 0 },
        ]);
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

    describe("Surface area distribution changes", () => {
      it("should delete system-generated reinstatement expenses when surface areas change", () => {
        const initialSteps = {
          URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: {
            completed: true,
            payload: {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 5000 },
            },
          },
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: {
              reinstatementExpenses: [{ purpose: "deimpermeabilization", amount: 100000 }],
            },
            defaultValues: {
              reinstatementExpenses: [{ purpose: "deimpermeabilization", amount: 100000 }],
            },
          },
          URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesCategoriesDistribution: { GREEN_SPACES: 5000 },
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            answers: {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 3000, TREE_FILLED_SPACE: 2000 },
            },
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
            (expense) => expense.purpose === "deimpermeabilization",
          )?.amount,
        ).toEqual(50000);
      });

      it("should not delete user answer reinstatement expenses when surface areas change", () => {
        const initialSteps = {
          URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: {
            completed: true,
            payload: {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 5000 },
            },
          },
          URBAN_PROJECT_EXPENSES_REINSTATEMENT: {
            completed: true,
            payload: {
              reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
            },
            defaultValues: {
              reinstatementExpenses: [{ purpose: "remediation", amount: 50000 }],
            },
          },
          URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesCategoriesDistribution: { GREEN_SPACES: 5000 },
            },
          },
        } satisfies ProjectCreationState["urbanProject"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            answers: {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 3000, TREE_FILLED_SPACE: 2000 },
            },
          }),
        );
        store.dispatch(confirmStepCompletion());

        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT).toEqual(
          initialSteps.URBAN_PROJECT_EXPENSES_REINSTATEMENT,
        );
      });
    });

    describe("Single category shortcut", () => {
      it("should automatically set surface area for single category selection", () => {
        const surfaceArea = 10000;

        const store = createTestStore({
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          siteData: { ...mockSiteData, surfaceArea },
        });

        store.dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["GREEN_SPACES"] },
          }),
        );
        store.dispatch(confirmStepCompletion());

        // Vérifier qu'un événement système a été créé pour la surface
        const stepsState = store.getState().projectCreation.urbanProject.steps;

        expect(stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA).toEqual({
          completed: true,
          payload: { spacesCategoriesDistribution: { GREEN_SPACES: surfaceArea } },
        });

        expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
          "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
        );
      });
    });
  });
});
