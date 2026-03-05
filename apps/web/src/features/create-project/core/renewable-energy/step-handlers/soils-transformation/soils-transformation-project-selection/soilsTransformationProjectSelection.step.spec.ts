import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils transformation project selection", () => {
  describe("completion", () => {
    it("should navigate to custom soils selection when project is custom", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
          answers: { soilsTransformationProject: "custom" },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION"
        ],
      ).toEqual({
        completed: true,
        payload: { soilsTransformationProject: "custom" },
      });
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
      );
    });

    it("should navigate to climate and biodiversity notice when site has significant biodiversity", () => {
      // relatedSiteData has FOREST_DECIDUOUS: 12000 which triggers biodiversity check
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
          answers: { soilsTransformationProject: "renaturation", soilsDistribution: {} },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION"
        ],
      ).toEqual({
        completed: true,
        // updateAnswersMiddleware computes soilsDistribution from site data
        payload: expect.objectContaining({ soilsTransformationProject: "renaturation" }),
      });
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE",
      );
    });

    it("should navigate to soils summary when site has no significant biodiversity", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...relatedSiteData,
          soilsDistribution: { BUILDINGS: 3000, MINERAL_SOIL: 5000 },
          surfaceArea: 8000,
        })
        .build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
          answers: { soilsTransformationProject: "renaturation", soilsDistribution: {} },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION"
        ],
      ).toEqual({
        completed: true,
        // updateAnswersMiddleware computes soilsDistribution from site data
        payload: expect.objectContaining({ soilsTransformationProject: "renaturation" }),
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_SUMMARY");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to soils transformation introduction", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION",
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });
  });
});
