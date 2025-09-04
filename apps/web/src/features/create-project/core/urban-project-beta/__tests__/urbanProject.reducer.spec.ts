import { describe, it, expect } from "vitest";

import { ProjectCreationState } from "../../createProject.reducer";
import { completeStep } from "../urbanProject.actions";
import { mockSiteData } from "./_siteData.mock";
import { createTestStore } from "./_testStoreHelpers";

describe("urbanProject.reducer - completeStep action", () => {
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
          URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION: {
            completed: true,
            payload: {
              buildingsUsesDistribution: { RESIDENTIAL: 3000, LOCAL_STORE: 1000 },
            },
          },
        } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
        });

        // Modification : suppression de LIVING_AND_ACTIVITY_SPACES
        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["GREEN_SPACES"] },
          }),
        );

        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

        expect(stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA).toEqual({
          completed: true,
          payload: {
            spacesCategoriesDistribution: {
              GREEN_SPACES: store.getState().projectCreation.siteData?.surfaceArea,
            },
          },
        });
        expect(stepsState.URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION).toEqual({
          completed: false,
          payload: undefined,
        });
        expect(stepsState.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA).toEqual({
          completed: false,
          payload: undefined,
        });
        expect(stepsState.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION).toEqual({
          completed: false,
          payload: undefined,
        });
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
        } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
          }),
        );

        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

        expect(stepsState.URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION).toEqual({
          completed: false,
          payload: undefined,
        });
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
        } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

        const store = createTestStore({ steps: initialSteps });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            answers: {
              livingAndActivitySpacesDistribution: {
                PRIVATE_GREEN_SPACES: 5000,
              },
            },
          }),
        );
        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

        expect(stepsState.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA).toEqual({
          completed: false,
          payload: undefined,
        });

        expect(stepsState.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION).toEqual({
          completed: false,
          payload: undefined,
        });

        expect(stepsState.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION).toEqual({
          completed: false,
          payload: undefined,
        });
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
        } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

        const store = createTestStore({ steps: initialSteps });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
            answers: { buildingsResalePlannedAfterDevelopment: true },
          }),
        );

        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

        expect(stepsState.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES).toEqual({
          completed: false,
          payload: undefined,
        });
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
        } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
          currentStep: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
            answers: { siteResalePlannedAfterDevelopment: false },
          }),
        );
        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

        expect(stepsState.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE).toEqual({
          completed: false,
          payload: undefined,
        });
      });
    });

    describe("Decontamination changes", () => {
      it("should delete reinstatement expenses when changing decontamination settings", () => {
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
        } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "none" },
          }),
        );

        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

        expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT).toEqual({
          completed: false,
          payload: undefined,
          defaultValue: undefined,
        });
      });

      it('should automatically set decontamination surface area for "none" plan', () => {
        const store = createTestStore({
          currentStep: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          siteData: { ...mockSiteData, hasContaminatedSoils: true },
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "none" },
          }),
        );
        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

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
          completeStep({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            answers: { decontaminationPlan: "unknown" },
          }),
        );

        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

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
              reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
            },
            defaultValues: {
              reinstatementExpenses: [{ purpose: "remediation", amount: 100000 }],
            },
          },
          URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesCategoriesDistribution: { GREEN_SPACES: 5000 },
            },
          },
        } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            answers: {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 3000, TREE_FILLED_SPACE: 2000 },
            },
          }),
        );

        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

        expect(stepsState.URBAN_PROJECT_EXPENSES_REINSTATEMENT).toEqual({
          completed: false,
          payload: undefined,
        });
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
        } satisfies ProjectCreationState["urbanProjectBeta"]["steps"];

        const store = createTestStore({
          steps: initialSteps,
        });

        store.dispatch(
          completeStep({
            stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            answers: {
              greenSpacesDistribution: { LAWNS_AND_BUSHES: 3000, TREE_FILLED_SPACE: 2000 },
            },
          }),
        );

        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

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
          completeStep({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            answers: { spacesCategories: ["GREEN_SPACES"] },
          }),
        );

        // Vérifier qu'un événement système a été créé pour la surface
        const stepsState = store.getState().projectCreation.urbanProjectBeta.steps;

        expect(stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA).toEqual({
          completed: true,
          payload: { spacesCategoriesDistribution: { GREEN_SPACES: surfaceArea } },
        });

        expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
          "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
        );
      });
    });
  });
});
