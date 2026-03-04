import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - non suitable soils surface", () => {
  it("should complete step and navigate to soils transformation project selection", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
        // empty input: middleware returns site soils unchanged
        answers: { nonSuitableSoilsSurfaceAreaToTransform: {} },
      }),
    );
    expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
      RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE: {
        completed: true,
        payload: {
          nonSuitableSoilsSurfaceAreaToTransform: {},
          baseSoilsDistributionForTransformation: {
            BUILDINGS: 3000,
            MINERAL_SOIL: 5000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
            FOREST_DECIDUOUS: 12000,
          },
        },
      },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");
  });

  it("should compute baseSoilsDistributionForTransformation by applying the requested soil transformations", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
        // transform all BUILDINGS (3000) → MINERAL_SOIL
        answers: { nonSuitableSoilsSurfaceAreaToTransform: { BUILDINGS: 3000 } },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps
        .RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE?.payload,
    ).toMatchObject({
      baseSoilsDistributionForTransformation: {
        MINERAL_SOIL: 8000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
        FOREST_DECIDUOUS: 12000,
      },
    });
  });

  it("should navigate back to non suitable soils selection", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
        "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION");
  });
});
