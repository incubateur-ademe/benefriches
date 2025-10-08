import { SiteNature } from "shared";
import { describe, it, expect } from "vitest";

import { requestStepCompletion, navigateToNext, navigateToPrevious } from "../urbanProject.actions";
import { UrbanProjectCreationStep } from "../urbanProjectSteps";
import { mockSiteData } from "./_siteData.mock";
import { createTestStore } from "./_testStoreHelpers";

const testScenarios = {
  withBuildingsAndContamination: mockSiteData,
  withoutContamination: {
    ...mockSiteData,
    hasContaminatedSoils: false,
  },
  nonFriche: {
    ...mockSiteData,
    nature: "AGRICULTURAL_OPERATION" as SiteNature,
  },
  withoutBuildingsOrContamination: {
    ...mockSiteData,
    hasContaminatedSoils: false,
    nature: "AGRICULTURAL_OPERATION" as SiteNature,
  },
};

describe("urbanProject.reducer - Navigation Consistency Tests", () => {
  describe("Previous/Next consistency for each step", () => {
    it("should have consistent navigation for URBAN_PROJECT_SPACES_CATEGORIES_SELECTION", () => {
      const store = createTestStore({
        currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
      });

      store.dispatch(navigateToNext());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      );

      store.dispatch(navigateToPrevious());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
      );

      store.dispatch(navigateToNext());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      );
    });

    it("should have consistent navigation for URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA", () => {
      const store = createTestStore();

      store.dispatch(navigateToNext());
      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES"] },
        }),
      );

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
      );

      store.dispatch(navigateToPrevious());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      );
    });

    it("should handle conditional navigation for buildings introduction", () => {
      const storeWithBuildings = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        steps: {
          URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
            completed: true,
            payload: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
          },
          URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
            completed: true,
            payload: { spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 10000 } },
          },
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
            completed: true,
            payload: { decontaminationPlan: "partial" },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
            completed: true,
            payload: { decontaminatedSurfaceArea: 1500 },
          },
        },
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      });

      storeWithBuildings.dispatch(navigateToPrevious());
      expect(storeWithBuildings.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
      );

      const storeWithoutContamination = createTestStore({
        siteData: testScenarios.withoutContamination,
        steps: {
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
          },
        },
        currentStep: "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      });

      storeWithoutContamination.dispatch(navigateToNext());
      expect(storeWithoutContamination.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      );

      storeWithoutContamination.dispatch(navigateToPrevious());
      expect(storeWithoutContamination.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      );
    });

    it("should handle stakeholders navigation based on site nature", () => {
      const storeFriche = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        steps: {
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
          },
        },
        currentStep: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
      });

      storeFriche.dispatch(navigateToNext());
      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
      );

      storeFriche.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: { projectDeveloper: { name: "Test", structureType: "company" } },
        }),
      );
      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      );

      storeFriche.dispatch(navigateToPrevious());
      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
      );

      const storeNonFriche = createTestStore({
        siteData: testScenarios.nonFriche,
        steps: {
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 0 } },
          },
        },
        currentStep: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
      });

      storeNonFriche.dispatch(navigateToNext());
      storeNonFriche.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: { projectDeveloper: { name: "Test", structureType: "company" } },
        }),
      );

      expect(storeNonFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
      );
    });

    it("should handle expenses navigation based on site nature", () => {
      const storeFriche = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        steps: {
          URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
            completed: true,
            payload: { projectDeveloper: { name: "Test", structureType: "company" } },
          },
          URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
            completed: true,
            payload: { reinstatementContractOwner: { name: "Test2", structureType: "company" } },
          },
          URBAN_PROJECT_SITE_RESALE_SELECTION: {
            completed: true,
            payload: { siteResalePlannedAfterDevelopment: true },
          },
          URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
            completed: true,
            payload: { buildingsResalePlannedAfterDevelopment: false },
          },
        },
        currentStep: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
      });

      storeFriche.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sitePurchaseSellingPrice: 500000, sitePurchasePropertyTransferDuties: 50000 },
        }),
      );

      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      );

      storeFriche.dispatch(navigateToPrevious());
      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
      );

      const storeNonFriche = createTestStore({
        siteData: testScenarios.nonFriche,
        currentStep: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
      });

      storeNonFriche.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sitePurchaseSellingPrice: 500000 },
        }),
      );

      expect(storeNonFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_INSTALLATION",
      );
    });

    it("should handle revenue navigation based on building and site resale decisions", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
          },
          URBAN_PROJECT_SITE_RESALE_SELECTION: {
            payload: { siteResalePlannedAfterDevelopment: true },
            completed: true,
          },
          URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
            payload: { buildingsResalePlannedAfterDevelopment: false },
            completed: true,
          },
        },
        currentStep: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      });

      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          answers: { siteResaleExpectedSellingPrice: 1000000 },
        }),
      );

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
      );

      store.dispatch(navigateToPrevious());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      );
    });

    it("should handle complex conditional navigation for green spaces", () => {
      const store = createTestStore({
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
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
          },
          URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: {
            completed: true,
            payload: { publicSpacesDistribution: { IMPERMEABLE_SURFACE: 2000 } },
          },
        },
        currentStep: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
      });

      store.dispatch(
        requestStepCompletion({
          stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
          answers: {
            publicSpacesDistribution: { IMPERMEABLE_SURFACE: 3000, PERMEABLE_SURFACE: 2000 },
          },
        }),
      );

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SPACES_SOILS_SUMMARY",
      );

      store.dispatch(navigateToPrevious());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
      );
    });
  });

  describe("Bidirectional navigation consistency", () => {
    it.each([
      {
        name: "Full workflow with buildings and contamination",
        siteData: testScenarios.withBuildingsAndContamination,
        steps: [
          "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
          "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
          "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",
          "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          "URBAN_PROJECT_SPACES_SOILS_SUMMARY",
          "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",
          "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
          "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
          "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION",
          "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
        ] as const,
      },
      {
        name: "Without contamination",
        siteData: testScenarios.withoutContamination,
        steps: [
          "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
          "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
          "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",
          "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          "URBAN_PROJECT_SPACES_SOILS_SUMMARY",
          "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
          "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
        ] as const,
      },
    ])(
      "should maintain consistency in bidirectional navigation for : $name",
      ({ siteData, steps }) => {
        const store = createTestStore({
          siteData,
          currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
        });

        steps.forEach((currentStep, index) => {
          const nextStep = steps[index + 1];
          if (!nextStep) {
            return;
          }

          switch (currentStep) {
            case "URBAN_PROJECT_BUILDINGS_INTRODUCTION":
            case "URBAN_PROJECT_SOILS_CARBON_SUMMARY":
            case "URBAN_PROJECT_SPACES_SOILS_SUMMARY":
            case "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION":
            case "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION":
            case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION":
            case "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION":
            case "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION":
            case "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION":
              store.dispatch(navigateToNext());
              break;
            case "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION":
              store.dispatch(
                requestStepCompletion({
                  stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
                  answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
                }),
              );
              break;
            case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION":
              store.dispatch(
                requestStepCompletion({
                  stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
                  answers: { livingAndActivitySpacesDistribution: { BUILDINGS: 500 } },
                }),
              );
              break;

            case "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION":
              store.dispatch(
                requestStepCompletion({
                  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
                  answers: { decontaminationPlan: "none" },
                }),
              );
              break;

            case "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA":
              store.dispatch(
                requestStepCompletion({
                  stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
                  answers: {
                    buildingsFloorSurfaceArea: 1000,
                  },
                }),
              );
              break;
            case "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
              store.dispatch(
                requestStepCompletion({
                  stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
                  answers: {
                    buildingsUsesDistribution: { RESIDENTIAL: 1000 },
                  },
                }),
              );
          }

          expect(store.getState().projectCreation.urbanProject.currentStep).toBe(nextStep);
        });

        for (let i = steps.length - 1; i > 0; i--) {
          const previousStep = steps[i - 1] as UrbanProjectCreationStep;

          store.dispatch(navigateToPrevious());
          expect(store.getState().projectCreation.urbanProject.currentStep).toBe(previousStep);
        }
      },
    );

    it("should handle edge cases in navigation consistency", () => {
      const store = createTestStore();

      store.dispatch(navigateToNext());

      store.dispatch(navigateToPrevious());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_CREATE_MODE_SELECTION",
      );

      store.dispatch(navigateToNext());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
      );
    });

    it("should handle navigation with pre-existing answers correctly", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
            completed: true,
            payload: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
          },
          URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA: {
            completed: true,
            payload: { spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 10000 } },
          },
        },

        currentStep: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      });

      store.dispatch(navigateToNext());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",
      );

      store.dispatch(navigateToPrevious());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      );
    });

    it("should handle decontamination navigation edge cases", () => {
      const storeNone = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        steps: {
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
            completed: true,
            payload: { decontaminationPlan: "none" },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
            completed: true,
            payload: { decontaminatedSurfaceArea: 0 },
          },
        },
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      });

      storeNone.dispatch(navigateToPrevious());
      expect(storeNone.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      );

      const storeUnknown = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        steps: {
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: {
            completed: true,
            payload: { decontaminationPlan: "unknown" },
          },
          URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: {
            completed: true,

            payload: { decontaminatedSurfaceArea: 500 },
          },
        },
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      });

      storeUnknown.dispatch(navigateToPrevious());
      expect(storeUnknown.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      );
    });
  });
});
