import { describe, expect, it } from "vitest";

import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";

describe("Urban project buildings sequencing - buildings on site, no building use planned in project", () => {
  describe("forward navigation", () => {
    it("skips buildings introduction and goes directly to demolition info when uses are PUBLIC_GREEN_SPACES (non-contaminated)", () => {
      // SOILS_CARBON_SUMMARY -> BUILDINGS_DEMOLITION_INFO (skips BUILDINGS_INTRODUCTION)
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SOILS_CARBON_SUMMARY")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2000 },
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
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

    it("skips buildings introduction and goes directly to demolition info when uses are OTHER_PUBLIC_SPACES (non-contaminated)", () => {
      // SOILS_CARBON_SUMMARY -> BUILDINGS_DEMOLITION_INFO (skips BUILDINGS_INTRODUCTION)
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SOILS_CARBON_SUMMARY")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2000 },
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["OTHER_PUBLIC_SPACES"] },
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

    it("skips buildings chapter entirely and goes to site resale when site has no buildings and uses are PUBLIC_GREEN_SPACES (non-contaminated)", () => {
      // SOILS_CARBON_SUMMARY -> SITE_RESALE_INTRODUCTION (skips buildings chapter)
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SOILS_CARBON_SUMMARY")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 0 },
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
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
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });
  });
});
