import { describe, expect, it } from "vitest";

import { StoreBuilder } from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { creationProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProject.selectors";

describe("selectNewBuildingsUsesFloorSurfaceAreaViewData", () => {
  it("pre-fills with remaining surface area when there is only one use", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 2400 } },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1600 } },
        },
      })
      .build();

    const result = creationProjectFormSelectors.selectNewBuildingsUsesFloorSurfaceAreaViewData(
      store.getState(),
    );

    expect(result.newBuildingsUsesFloorSurfaceArea).toEqual({ RESIDENTIAL: 800 });
  });

  it("does not pre-fill when there are multiple uses", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 2400, OFFICES: 600 },
          },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: {
            existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1600, OFFICES: 400 },
          },
        },
      })
      .build();

    const result = creationProjectFormSelectors.selectNewBuildingsUsesFloorSurfaceAreaViewData(
      store.getState(),
    );

    expect(result.newBuildingsUsesFloorSurfaceArea).toBeUndefined();
  });

  it("does not override existing answers even with single use", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 2400 } },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1600 } },
        },
        URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 500 } },
        },
      })
      .build();

    const result = creationProjectFormSelectors.selectNewBuildingsUsesFloorSurfaceAreaViewData(
      store.getState(),
    );

    expect(result.newBuildingsUsesFloorSurfaceArea).toEqual({ RESIDENTIAL: 500 });
  });

  it("pre-fills with zero when remaining surface area is zero", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 2400 } },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 2400 } },
        },
      })
      .build();

    const result = creationProjectFormSelectors.selectNewBuildingsUsesFloorSurfaceAreaViewData(
      store.getState(),
    );

    expect(result.newBuildingsUsesFloorSurfaceArea).toEqual({ RESIDENTIAL: 0 });
  });
});
