import { SiteNature } from "shared";
import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { mockSiteData } from "./_siteData.mock";
import { createTestStore } from "./_testStoreHelpers";

const { navigateToNext, navigateToPrevious, requestStepCompletion } =
  creationProjectFormUrbanActions;

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
    it("should navigate from buildings introduction to soils carbon summary when uses include buildings", () => {
      const storeWithBuildings = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        steps: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
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
        "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      );
    });

    it("should handle stakeholders navigation based on site nature", () => {
      const storeFriche = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        steps: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
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
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
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
            payload: { siteResaleSelection: "yes" },
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
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SITE_RESALE_SELECTION: {
            payload: { siteResaleSelection: "yes" },
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
  });

  describe("Bidirectional navigation consistency", () => {
    it("should handle edge cases in navigation consistency", () => {
      const store = createTestStore();

      store.dispatch(navigateToNext());

      store.dispatch(navigateToPrevious());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_CREATE_MODE_SELECTION",
      );

      store.dispatch(navigateToNext());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_USES_INTRODUCTION",
      );
    });

    it("should navigate from buildings introduction to soils carbon summary when uses include buildings", () => {
      // When uses include buildings, buildings introduction always goes back to soils carbon summary
      const storeNone = createTestStore({
        siteData: testScenarios.withBuildingsAndContamination,
        steps: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
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
        "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      );
    });
  });
});
