import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils transformation custom surface area allocation", () => {
  describe("completion", () => {
    it("should navigate to climate and biodiversity notice when site has significant biodiversity", () => {
      // relatedSiteData has FOREST_DECIDUOUS: 12000 which triggers biodiversity check
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
          answers: { soilsDistribution: { MINERAL_SOIL: 5000, BUILDINGS: 3000 } },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION"
        ],
      ).toEqual({
        completed: true,
        payload: { soilsDistribution: { MINERAL_SOIL: 5000, BUILDINGS: 3000 } },
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
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
          answers: { soilsDistribution: { MINERAL_SOIL: 5000, BUILDINGS: 3000 } },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION"
        ],
      ).toEqual({
        completed: true,
        payload: { soilsDistribution: { MINERAL_SOIL: 5000, BUILDINGS: 3000 } },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_SUMMARY");
    });

    it("should strip empty surfaces from soilsDistribution", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
          answers: { soilsDistribution: { MINERAL_SOIL: 5000, BUILDINGS: 0 } },
        }),
      );
      const payload =
        store.getState().projectCreation.renewableEnergyProject.steps
          .RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION?.payload;
      expect(payload?.soilsDistribution).toEqual({ MINERAL_SOIL: 5000 });
    });
  });

  describe("back navigation", () => {
    it("should navigate back to custom soils selection", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        ])
        .build();
      store.dispatch(navigateToPrevious());
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
      );
    });
  });
});
