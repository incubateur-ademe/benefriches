import { SiteNature } from "shared";
import { beforeEach, describe, it, expect, vi } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { mockSiteData } from "./_siteData.mock";
import { StoreBuilder } from "./_testStoreHelpers";

const mockedEnvVarsModule = vi.hoisted(() => ({
  BENEFRICHES_ENV: {
    urbanProjectBuildingsReuseChapterEnabled: false,
  },
}));

vi.mock("@/app/envVars", () => mockedEnvVarsModule);

const { nextStepRequested, previousStepRequested, stepCompletionRequested } =
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
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = false;
  });

  describe("Previous/Next consistency for each step", () => {
    it("should navigate from buildings introduction to soils carbon summary when uses include buildings", () => {
      const storeWithBuildings = new StoreBuilder()
        .withSiteData(testScenarios.withBuildingsAndContamination)
        .withSteps({
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
        })
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_INTRODUCTION")
        .build();

      storeWithBuildings.dispatch(previousStepRequested());
      expect(storeWithBuildings.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      );
    });

    it("should handle stakeholders navigation based on site nature", () => {
      const storeFriche = new StoreBuilder()
        .withSiteData(testScenarios.withBuildingsAndContamination)
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
        })
        .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
        .build();

      storeFriche.dispatch(nextStepRequested());
      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
      );

      storeFriche.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: { projectDeveloper: { name: "Test", structureType: "company" } },
        }),
      );
      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      );

      storeFriche.dispatch(previousStepRequested());
      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
      );

      const storeNonFriche = new StoreBuilder()
        .withSiteData(testScenarios.nonFriche)
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
          },
        })
        .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
        .build();

      storeNonFriche.dispatch(nextStepRequested());
      storeNonFriche.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: { projectDeveloper: { name: "Test", structureType: "company" } },
        }),
      );

      expect(storeNonFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_INTRODUCTION",
      );
    });

    it("should go back from reinstatement contract owner to buildings developer when new construction exists", () => {
      const store = new StoreBuilder()
        .withSiteData(testScenarios.withBuildingsAndContamination)
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 1000 },
          },
          URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
            completed: true,
            payload: { projectDeveloper: { name: "Test", structureType: "company" } },
          },
          URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
            completed: true,
            payload: { developerWillBeBuildingsConstructor: true },
          },
        })
        .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER")
        .build();

      store.dispatch(previousStepRequested());

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
      );
    });

    it("should go back from expenses introduction to buildings developer on non-friche site with new construction", () => {
      const store = new StoreBuilder()
        .withSiteData(testScenarios.nonFriche)
        .withSteps({
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 1000 },
          },
          URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
            completed: true,
            payload: { projectDeveloper: { name: "Test", structureType: "company" } },
          },
          URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
            completed: true,
            payload: { developerWillBeBuildingsConstructor: true },
          },
        })
        .withCurrentStep("URBAN_PROJECT_EXPENSES_INTRODUCTION")
        .build();

      store.dispatch(previousStepRequested());

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
      );
    });

    it("should handle expenses navigation based on site nature", () => {
      const storeFriche = new StoreBuilder()
        .withSiteData(testScenarios.withBuildingsAndContamination)
        .withSteps({
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
        })
        .withCurrentStep("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS")
        .build();

      storeFriche.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sitePurchaseSellingPrice: 500000, sitePurchasePropertyTransferDuties: 50000 },
        }),
      );

      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      );

      storeFriche.dispatch(previousStepRequested());
      expect(storeFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
      );

      const storeNonFriche = new StoreBuilder()
        .withSiteData(testScenarios.nonFriche)
        .withCurrentStep("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS")
        .build();

      storeNonFriche.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sitePurchaseSellingPrice: 500000 },
        }),
      );

      expect(storeNonFriche.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_EXPENSES_INSTALLATION",
      );
    });

    it("should handle revenue navigation based on building and site resale decisions", () => {
      const store = new StoreBuilder()
        .withSteps({
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
        })
        .withCurrentStep("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
          answers: { siteResaleExpectedSellingPrice: 1000000 },
        }),
      );

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
      );

      store.dispatch(previousStepRequested());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      );
    });
  });

  describe("Bidirectional navigation consistency", () => {
    it("should handle edge cases in navigation consistency", () => {
      const store = new StoreBuilder().build();

      store.dispatch(nextStepRequested());

      store.dispatch(previousStepRequested());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_CREATE_MODE_SELECTION",
      );

      store.dispatch(nextStepRequested());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_USES_INTRODUCTION",
      );
    });

    it("should navigate from buildings introduction to soils carbon summary when uses include buildings", () => {
      // When uses include buildings, buildings introduction always goes back to soils carbon summary
      const storeNone = new StoreBuilder()
        .withSiteData(testScenarios.withBuildingsAndContamination)
        .withSteps({
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
        })
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_INTRODUCTION")
        .build();

      storeNone.dispatch(previousStepRequested());
      expect(storeNone.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      );
    });

    it("should go back from site resale introduction to the last buildings step before resale (flag ON)", () => {
      mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
      const store = new StoreBuilder()
        .withSiteData(testScenarios.withoutContamination)
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 2000 },
          },
          URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1600, OFFICES: 400 },
            },
          },
          URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 800, OFFICES: 200 },
            },
          },
        })
        .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
        .build();

      store.dispatch(previousStepRequested());

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
      );
    });

    it("should go back from decontamination introduction to the last buildings step before decontamination (flag ON)", () => {
      mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
      const store = new StoreBuilder()
        .withSiteData(testScenarios.withBuildingsAndContamination)
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 1500, IMPERMEABLE_SOILS: 8500 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 1500 },
          },
        })
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION")
        .build();

      store.dispatch(previousStepRequested());

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO",
      );
    });
  });
});
