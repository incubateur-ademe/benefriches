import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { mockSiteData } from "../../_siteData.mock";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested, stepCompletionRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Buildings navigation", () => {
  describe("Stakeholders → buildings developer routing", () => {
    it("routes from project developer to buildings developer when new buildings will be constructed", () => {
      const store = new StoreBuilder()
        .withSiteData({
          nature: "AGRICULTURAL_OPERATION",
        } as never)
        .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER")
        .withSteps({
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: {
                BUILDINGS: 3000,
              },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: {
              buildingsFootprintToReuse: 1000,
            },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: {
            projectDeveloper: {
              name: "Promoteur Test",
              structureType: "company",
            },
          },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER");
    });
  });

  describe("Buildings chapter exit routing", () => {
    it("routes from the last buildings step to site resale when the site is not a FRICHE and has no contaminated soils", () => {
      const store = new StoreBuilder()
        .withSiteData({
          nature: "AGRICULTURAL_OPERATION",
          hasContaminatedSoils: false,
          contaminatedSoilSurface: 0,
        })
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA")
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
            payload: { buildingsFootprintToReuse: 1500 },
          },
          URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1000, OFFICES: 500 },
            },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1400, OFFICES: 100 } },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("routes from the last buildings step to decontamination when the site is not a FRICHE but has contaminated soils", () => {
      const store = new StoreBuilder()
        .withSiteData({
          nature: "AGRICULTURAL_OPERATION",
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 2000,
        })
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA")
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
            payload: { buildingsFootprintToReuse: 1500 },
          },
          URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
            completed: true,
            payload: {
              existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1000, OFFICES: 500 },
            },
          },
        })
        .build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1400, OFFICES: 100 } },
        }),
      );

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });

  describe("Buildings introduction backward navigation", () => {
    it("goes back to soils carbon summary when uses include buildings (contamination: partial)", () => {
      const store = new StoreBuilder()
        .withSiteData(mockSiteData)
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

      store.dispatch(previousStepRequested());

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      );
    });

    it("goes back to soils carbon summary when uses include buildings (contamination: none)", () => {
      const store = new StoreBuilder()
        .withSiteData(mockSiteData)
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

      store.dispatch(previousStepRequested());

      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_SOILS_CARBON_SUMMARY",
      );
    });
  });
});
