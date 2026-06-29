import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../urbanProject.actions";
import { mockSiteData } from "./_siteData.mock";
import { StoreBuilder } from "./_testStoreHelpers";

const { nextStepRequested, previousStepRequested } = creationProjectFormUrbanActions;

const testScenarios = {
  withBuildingsAndContamination: mockSiteData,
};

describe("urbanProject.reducer - Navigation Framework Tests", () => {
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
  });

  describe("Bidirectional navigation consistency", () => {
    it("should handle first step correctly", () => {
      const store = new StoreBuilder().withCurrentUrbanProjectGroupStep().build();
      expect(store.getState().projectCreation.currentProjectFlow).toBe("URBAN_PROJECT");

      store.dispatch(previousStepRequested());
      const newState = store.getState().projectCreation;
      expect(newState.urbanProject.currentStep).toBe("URBAN_PROJECT_USES_INTRODUCTION");
      expect(newState.currentProjectFlow).toBe("USE_CASE_SELECTION");
    });

    it("should handle edge cases in navigation consistency", () => {
      const store = new StoreBuilder().build();

      store.dispatch(nextStepRequested());

      store.dispatch(previousStepRequested());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_USES_INTRODUCTION",
      );

      store.dispatch(nextStepRequested());
      expect(store.getState().projectCreation.urbanProject.currentStep).toBe(
        "URBAN_PROJECT_USES_SELECTION",
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
  });
});
