import { describe, it, expect, beforeEach } from "vitest";

import { completeStep, navigateToNext } from "../urbanProject.actions";
import { createTestStore } from "./_testStoreHelpers";

describe("urbanProject.reducer", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe("Complete workflow from start to finish", () => {
    it("should navigate through all steps correctly", () => {
      const state = store.getState().projectCreation;

      // Étape ----
      expect(state.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
      );

      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES", "GREEN_SPACES"],
          },
        }),
      );

      let currentState = store.getState().projectCreation;
      expect(
        currentState.urbanProjectBeta.steps.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION,
      ).toBeDefined();
      expect(
        currentState.urbanProjectBeta.steps.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION?.completed,
      ).toBe(true);
      expect(
        currentState.urbanProjectBeta.steps.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION?.payload,
      ).toEqual({
        spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES", "GREEN_SPACES"],
      });
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
      );

      // Étape ----
      store.dispatch(
        completeStep({
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

      currentState = store.getState().projectCreation;
      expect(
        currentState.urbanProjectBeta.steps.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA?.completed,
      ).toBe(true);
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION" }),
      );
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION" }),
      );
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
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

      currentState = store.getState().projectCreation;
      expect(
        currentState.urbanProjectBeta.steps
          .URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION?.completed,
      ).toEqual(true);
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
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

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
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

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_SOILS_SUMMARY" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      );

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SOILS_CARBON_SUMMARY" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION" }),
      );
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: {
            decontaminationPlan: "partial",
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
          answers: {
            decontaminatedSurfaceArea: 1500,
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
          answers: {
            buildingsFloorSurfaceArea: 4000,
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
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

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: {
            projectDeveloper: {
              name: "Promoteur Test",
              structureType: "company",
            },
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          answers: {
            reinstatementContractOwner: {
              name: "Entreprise de Remise en État",
              structureType: "company",
            },
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
      );

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SITE_RESALE_SELECTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
          answers: {
            siteResalePlannedAfterDevelopment: true,
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
          answers: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_EXPENSES_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: {
            sitePurchaseSellingPrice: 500000,
            sitePurchasePropertyTransferDuties: 50000,
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
          answers: {
            reinstatementExpenses: [
              { purpose: "demolition", amount: 100000 },
              { purpose: "remediation", amount: 200000 },
            ],
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_EXPENSES_INSTALLATION",
          answers: {
            installationExpenses: [
              { purpose: "development_works", amount: 800000 },
              { purpose: "technical_studies", amount: 50000 },
            ],
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_REVENUE_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          answers: {
            siteResaleExpectedSellingPrice: 1000000,
            siteResaleExpectedPropertyTransferDuties: 80000,
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
          answers: {
            buildingsResaleSellingPrice: 2000000,
            buildingsResalePropertyTransferDuties: 150000,
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
      );

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
          answers: {
            financialAssistanceRevenues: [{ source: "public_subsidies", amount: 200000 }],
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_SCHEDULE_INTRODUCTION");

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SCHEDULE_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SCHEDULE_PROJECTION",
      );

      // Étape ----
      store.dispatch(
        completeStep({
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

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_PROJECT_PHASE");

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_PROJECT_PHASE",
          answers: {
            projectPhase: "planning",
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_NAMING");

      // Étape ----
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_NAMING",
          answers: {
            name: "Projet Urbain Test",
            description: "Description du projet de test",
          },
        }),
      );

      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_FINAL_SUMMARY");

      // Étape ----
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_FINAL_SUMMARY" }));

      // Étape ----
      currentState = store.getState().projectCreation;
      expect(currentState.urbanProjectBeta.currentStep).toBe("URBAN_PROJECT_CREATION_RESULT");

      expect(Object.keys(currentState.urbanProjectBeta.steps).length).toEqual(38);
    });

    it("should handle single category shortcut correctly", () => {
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" }));

      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: {
            spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"],
          },
        }),
      );

      const currentState = store.getState().projectCreation;

      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      );

      expect(
        currentState.urbanProjectBeta.steps.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION?.completed,
      ).toEqual(true);
      expect(
        currentState.urbanProjectBeta.steps.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA?.payload,
      ).toEqual({
        spacesCategoriesDistribution: {
          LIVING_AND_ACTIVITY_SPACES: currentState.siteData?.surfaceArea,
        },
      });
    });

    it('should handle decontamination plan "none" correctly', () => {
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" }));

      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
        }),
      );

      store.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION" }),
      );
      store.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION" }),
      );

      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          answers: {
            livingAndActivitySpacesDistribution: { BUILDINGS: 2000 },
          },
        }),
      );

      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_SOILS_SUMMARY" }));
      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SOILS_CARBON_SUMMARY" }));
      store.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION" }),
      );

      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: {
            decontaminationPlan: "none",
          },
        }),
      );

      const currentState = store.getState().projectCreation;

      expect(currentState.urbanProjectBeta.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      );

      expect(
        currentState.urbanProjectBeta.steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA,
      ).toBeDefined();
      expect(
        currentState.urbanProjectBeta.steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA
          ?.payload?.decontaminatedSurfaceArea,
      ).toBe(0);
    });
  });
});
