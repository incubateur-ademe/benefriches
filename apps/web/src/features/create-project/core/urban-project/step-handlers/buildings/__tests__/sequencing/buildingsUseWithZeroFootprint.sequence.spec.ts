import { describe, expect, it } from "vitest";

import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";

describe("Urban project buildings sequencing - building use planned but no buildings surface area", () => {
  describe("forward navigation", () => {
    it("skips the buildings chapter entirely when the buildings footprint is 0 and the site has no buildings", () => {
      // SOILS_CARBON_SUMMARY -> STAKEHOLDERS_INTRODUCTION (skips the whole buildings chapter)
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SOILS_CARBON_SUMMARY")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 0 },
          nature: "AGRICULTURAL_OPERATION",
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { IMPERMEABLE_SOILS: 10000 },
            },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
    });

    it("still routes to the demolition info when the buildings footprint is 0 but the site has existing buildings", () => {
      // SOILS_CARBON_SUMMARY -> BUILDINGS_DEMOLITION_INFO (existing buildings still have to be dealt with)
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SOILS_CARBON_SUMMARY")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2000 },
          nature: "AGRICULTURAL_OPERATION",
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { IMPERMEABLE_SOILS: 10000 },
            },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");
    });
  });

  describe("previous navigation", () => {
    it("goes back from the stakeholders introduction to the soils carbon summary, never into the buildings chapter", () => {
      // STAKEHOLDERS_INTRODUCTION -> SOILS_CARBON_SUMMARY
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 0 },
          nature: "AGRICULTURAL_OPERATION",
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { IMPERMEABLE_SOILS: 10000 },
            },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_CARBON_SUMMARY");
    });
  });
});
