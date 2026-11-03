import type { UrbanZoneLandParcelType } from "shared";

import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - missing information step", () => {
  const MULTI_PARCEL_STEPS = {
    URBAN_ZONE_LAND_PARCELS_SELECTION: {
      completed: true,
      payload: {
        landParcelTypes: ["PUBLIC_SPACES", "SERVICED_SURFACE"] as UrbanZoneLandParcelType[],
      },
    },
    URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION: {
      completed: true,
      payload: { surfaceAreas: { PUBLIC_SPACES: 3000, SERVICED_SURFACE: 7000 } },
    },
  };

  it("is shown after the soils and spaces introduction", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION")
      .withUrbanZoneSteps(MULTI_PARCEL_STEPS)
      .build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_MISSING_INFORMATION");
  });

  it("leads to the first selected parcel's soils distribution", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_MISSING_INFORMATION")
      .withUrbanZoneSteps(MULTI_PARCEL_STEPS)
      .build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION");
  });

  it("goes back to the soils and spaces introduction", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_MISSING_INFORMATION")
      .withUrbanZoneSteps(MULTI_PARCEL_STEPS)
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION");
  });
});
