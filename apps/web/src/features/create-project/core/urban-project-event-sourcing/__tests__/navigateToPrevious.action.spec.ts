import { SiteNature } from "shared";
import { describe, it, expect } from "vitest";

import { UrbanProjectCustomCreationStep } from "../../urban-project/creationSteps";
import { completeStep, navigateToNext, navigateToPrevious } from "../urbanProject.actions";
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
      const store = createTestStore();

      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      );

      store.dispatch(navigateToPrevious({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION" }));
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
      );

      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      );
    });

    it("should have consistent navigation for URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA", () => {
      const store = createTestStore();

      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" }));
      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
          answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES", "PUBLIC_SPACES"] },
        }),
      );

      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
      );

      store.dispatch(
        navigateToPrevious({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA" }),
      );
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      );
    });

    it("should handle conditional navigation for buildings introduction", () => {
      const storeWithBuildings = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            payload: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
            payload: { spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 10000 } },
            timestamp: Date.now(),
            source: "system",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            payload: { decontaminationPlan: "partial" },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
            payload: { decontaminatedSurfaceArea: 1500 },
            timestamp: Date.now(),
            source: "user",
          },
        ],
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      });

      storeWithBuildings.dispatch(
        navigateToPrevious({ stepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION" }),
      );
      expect(
        storeWithBuildings.getState().projectCreation.urbanProjectEventSourcing.currentStep,
      ).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");

      const storeWithoutContamination = createTestStore({
        siteData: testScenarios.withoutContamination,
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
            timestamp: Date.now(),
            source: "user",
          },
        ],
        currentStep: "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      });

      storeWithoutContamination.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_SOILS_CARBON_SUMMARY" }),
      );
      expect(
        storeWithoutContamination.getState().projectCreation.urbanProjectEventSourcing.currentStep,
      ).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");

      storeWithoutContamination.dispatch(
        navigateToPrevious({ stepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION" }),
      );
      expect(
        storeWithoutContamination.getState().projectCreation.urbanProjectEventSourcing.currentStep,
      ).toBe("URBAN_PROJECT_SOILS_CARBON_SUMMARY");
    });

    it("should handle stakeholders navigation based on site nature", () => {
      const storeFriche = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
            timestamp: Date.now(),
            source: "user",
          },
        ],
        currentStep: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
      });

      storeFriche.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION" }));
      expect(storeFriche.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
      );

      storeFriche.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: { projectDeveloper: { name: "Test", structureType: "company" } },
        }),
      );
      expect(storeFriche.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      );

      storeFriche.dispatch(
        navigateToPrevious({ stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER" }),
      );
      expect(storeFriche.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
      );

      const storeNonFriche = createTestStore({
        siteData: testScenarios.nonFriche,
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 0 } },
            timestamp: Date.now(),
            source: "user",
          },
        ],
        currentStep: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
      });

      storeNonFriche.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION" }),
      );
      storeNonFriche.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: { projectDeveloper: { name: "Test", structureType: "company" } },
        }),
      );

      expect(storeNonFriche.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
      );
    });

    it("should handle expenses navigation based on site nature", () => {
      const storeFriche = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
            payload: { projectDeveloper: { name: "Test", structureType: "company" } },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
            payload: { reinstatementContractOwner: { name: "Test2", structureType: "company" } },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
            payload: { siteResalePlannedAfterDevelopment: true },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
            payload: { buildingsResalePlannedAfterDevelopment: false },
            timestamp: Date.now(),
            source: "user",
          },
        ],
        currentStep: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
      });

      storeFriche.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sitePurchaseSellingPrice: 500000, sitePurchasePropertyTransferDuties: 50000 },
        }),
      );

      expect(storeFriche.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      );

      storeFriche.dispatch(navigateToPrevious({ stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT" }));
      expect(storeFriche.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
      );

      const storeNonFriche = createTestStore({
        siteData: testScenarios.nonFriche,
        currentStep: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
      });

      storeNonFriche.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sitePurchaseSellingPrice: 500000 },
        }),
      );

      expect(storeNonFriche.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_INSTALLATION",
      );
    });

    it("should handle revenue navigation based on building and site resale decisions", () => {
      const store = createTestStore({
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
            payload: { siteResalePlannedAfterDevelopment: true },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
            payload: { buildingsResalePlannedAfterDevelopment: false },
            timestamp: Date.now(),
            source: "user",
          },
        ],
        currentStep: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      });

      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          answers: { siteResaleExpectedSellingPrice: 1000000 },
        }),
      );

      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
      );

      store.dispatch(
        navigateToPrevious({
          stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
        }),
      );
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      );
    });

    it("should handle complex conditional navigation for green spaces", () => {
      const store = createTestStore({
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
            payload: {
              spacesCategoriesDistribution: {
                LIVING_AND_ACTIVITY_SPACES: 5000,
                PUBLIC_SPACES: 5000,
              },
            },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
            payload: { publicSpacesDistribution: { IMPERMEABLE_SURFACE: 2000 } },
            timestamp: Date.now(),
            source: "user",
          },
        ],
        currentStep: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
      });

      store.dispatch(
        completeStep({
          stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
          answers: {
            publicSpacesDistribution: { IMPERMEABLE_SURFACE: 3000, PERMEABLE_SURFACE: 2000 },
          },
        }),
      );

      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_SOILS_SUMMARY",
      );

      store.dispatch(navigateToPrevious({ stepId: "URBAN_PROJECT_SPACES_SOILS_SUMMARY" }));
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
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
        const store = createTestStore({ siteData });

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
              store.dispatch(navigateToNext({ stepId: currentStep }));
              break;
            case "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION":
              store.dispatch(
                completeStep({
                  stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
                  answers: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
                }),
              );
              break;
            case "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION":
              store.dispatch(
                completeStep({
                  stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
                  answers: { livingAndActivitySpacesDistribution: { BUILDINGS: 500 } },
                }),
              );
              break;

            case "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION":
              store.dispatch(
                completeStep({
                  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
                  answers: { decontaminationPlan: "none" },
                }),
              );
              break;

            case "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA":
              store.dispatch(
                completeStep({
                  stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
                  answers: {
                    buildingsFloorSurfaceArea: 1000,
                  },
                }),
              );
              break;
            case "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
              store.dispatch(
                completeStep({
                  stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
                  answers: {
                    buildingsUsesDistribution: { RESIDENTIAL: 1000 },
                  },
                }),
              );
          }

          expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
            nextStep,
          );
        });

        for (let i = steps.length - 1; i > 0; i--) {
          const currentStep = steps[i] as UrbanProjectCustomCreationStep;
          const previousStep = steps[i - 1] as UrbanProjectCustomCreationStep;

          store.dispatch(navigateToPrevious({ stepId: currentStep }));
          expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
            previousStep,
          );
        }
      },
    );

    it("should handle edge cases in navigation consistency", () => {
      const store = createTestStore();

      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" }));

      store.dispatch(navigateToPrevious({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION" }));
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
      );

      store.dispatch(navigateToNext({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION" }));
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
      );
    });

    it("should handle navigation with pre-existing events correctly", () => {
      const store = createTestStore({
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
            payload: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
            payload: { spacesCategoriesDistribution: { LIVING_AND_ACTIVITY_SPACES: 10000 } },
            timestamp: Date.now(),
            source: "system",
          },
        ],
        currentStep: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      });

      store.dispatch(
        navigateToNext({ stepId: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION" }),
      );
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",
      );

      store.dispatch(
        navigateToPrevious({
          stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION",
        }),
      );
      expect(store.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      );

      expect(store.getState().projectCreation.urbanProjectEventSourcing.events).toHaveLength(2);
    });

    it("should handle decontamination navigation edge cases", () => {
      const storeNone = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            payload: { decontaminationPlan: "none" },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
            payload: { decontaminatedSurfaceArea: 0 },
            timestamp: Date.now(),
            source: "system",
          },
        ],
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      });

      storeNone.dispatch(navigateToPrevious({ stepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION" }));
      expect(storeNone.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      );

      const storeUnknown = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        events: [
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 2000 } },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
            payload: { decontaminationPlan: "unknown" },
            timestamp: Date.now(),
            source: "user",
          },
          {
            type: "ANSWER_SET",
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
            payload: { decontaminatedSurfaceArea: 500 },
            timestamp: Date.now(),
            source: "system",
          },
        ],
        currentStep: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",
      });

      storeUnknown.dispatch(navigateToPrevious({ stepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION" }));
      expect(storeUnknown.getState().projectCreation.urbanProjectEventSourcing.currentStep).toBe(
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      );
    });
  });
});
