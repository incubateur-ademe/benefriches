import { describe, it, expect, beforeEach } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { createTestStore, getCurrentStep } from "./_testStoreHelpers";

const { navigateToNext, requestStepCompletion } = creationProjectFormUrbanActions;

describe("urbanProject.reducer - requestStepCompletion without validation", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe("Complete workflow from start to finish", () => {
    it("should navigate through all steps correctly", () => {
      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_CREATE_MODE_SELECTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES", "GREEN_SPACES"],
          },
        }),
      );
      const currentState = store.getState().projectCreation;
      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION,
      ).toBeDefined();
      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION?.completed,
      ).toBe(true);
      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION?.payload,
      ).toEqual({
        spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES", "GREEN_SPACES"],
      });

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
          answers: {
            spacesCategoriesDistribution: {
              LIVING_AND_ACTIVITY_SPACES: 4000,
              PUBLIC_SPACES: 3000,
              GREEN_SPACES: 3000,
            },
          },
        }),
      );

      expect(
        store.getState().projectCreation.urbanProject.steps
          .URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA?.completed,
      ).toBe(true);

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe(
        "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",
      );
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe(
        "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
      );
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          answers: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 2000,
              IMPERMEABLE_SURFACE: 1000,
              PERMEABLE_SURFACE: 500,
              PRIVATE_GREEN_SPACES: 500,
            },
          },
        }),
      );

      expect(
        store.getState().projectCreation.urbanProject.steps
          .URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION?.completed,
      ).toEqual(true);

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
          answers: {
            publicSpacesDistribution: {
              IMPERMEABLE_SURFACE: 1500,
              PERMEABLE_SURFACE: 1000,
              GRASS_COVERED_SURFACE: 500,
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_GREEN_SPACES_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
          answers: {
            greenSpacesDistribution: {
              LAWNS_AND_BUSHES: 1500,
              TREE_FILLED_SPACE: 1000,
              PAVED_ALLEY: 300,
              GRAVEL_ALLEY: 200,
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_CARBON_SUMMARY");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: {
            decontaminationPlan: "partial",
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
          answers: {
            decontaminatedSurfaceArea: 1500,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
      );
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
          answers: {
            buildingsFloorSurfaceArea: 4000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      // expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USE_SELECTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",
          answers: {
            buildingsUsesSelection: ["RESIDENTIAL", "LOCAL_STORE", "OFFICES"],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          answers: {
            buildingsUsesDistribution: {
              RESIDENTIAL: 2500,
              LOCAL_STORE: 1000,
              OFFICES: 500,
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: {
            projectDeveloper: {
              name: "Promoteur Test",
              structureType: "company",
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          answers: {
            reinstatementContractOwner: {
              name: "Entreprise de Remise en État",
              structureType: "company",
            },
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_SELECTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
          answers: { siteResaleSelection: "yes" },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
          answers: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          answers: {
            siteResaleExpectedSellingPrice: 1000000,
            siteResaleExpectedPropertyTransferDuties: 80000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
          answers: {
            buildingsResaleSellingPrice: 2000000,
            buildingsResalePropertyTransferDuties: 150000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
          answers: {
            financialAssistanceRevenues: [{ source: "public_subsidies", amount: 200000 }],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: {
            sitePurchaseSellingPrice: 500000,
            sitePurchasePropertyTransferDuties: 50000,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
          answers: {
            reinstatementExpenses: [
              { purpose: "demolition", amount: 100000 },
              { purpose: "remediation", amount: 200000 },
            ],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
          answers: {
            installationExpenses: [
              { purpose: "development_works", amount: 800000 },
              { purpose: "technical_studies", amount: 50000 },
            ],
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SCHEDULE_PROJECTION");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION",
          answers: {
            reinstatementSchedule: {
              startDate: "2024-01-01",
              endDate: "2024-06-30",
            },
            installationSchedule: {
              startDate: "2024-07-01",
              endDate: "2025-12-31",
            },
            firstYearOfOperation: 2026,
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PROJECT_PHASE");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_PROJECT_PHASE",
          answers: {
            projectPhase: "planning",
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_NAMING");
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_NAMING",
          answers: {
            name: "Projet Urbain Test",
            description: "Description du projet de test",
          },
        }),
      );

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_FINAL_SUMMARY");
      store.dispatch(navigateToNext());

      // Étape ----
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_CREATION_RESULT");

      expect(Object.keys(store.getState().projectCreation.urbanProject.steps).length).toEqual(39);
    });

    it("should handle single category shortcut correctly", () => {
      store.dispatch(navigateToNext());

      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
          },
        }),
      );

      const currentState = store.getState().projectCreation;

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");

      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION?.completed,
      ).toEqual(true);
      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA?.payload,
      ).toEqual({
        spacesCategoriesDistribution: {
          LIVING_AND_ACTIVITY_SPACES: currentState.siteData?.surfaceArea,
        },
      });
    });

    it('should handle decontamination plan "none" correctly', () => {
      store.dispatch(navigateToNext());

      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
        }),
      );

      store.dispatch(navigateToNext());
      store.dispatch(navigateToNext());

      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          answers: {
            livingAndActivitySpacesDistribution: { BUILDINGS: 2000 },
          },
        }),
      );

      store.dispatch(navigateToNext());
      store.dispatch(navigateToNext());
      store.dispatch(navigateToNext());

      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: {
            decontaminationPlan: "none",
          },
        }),
      );

      const currentState = store.getState().projectCreation;

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");

      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA,
      ).toBeDefined();
      expect(
        currentState.urbanProject.steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA?.payload
          ?.decontaminatedSurfaceArea,
      ).toBe(0);
    });
  });
});
