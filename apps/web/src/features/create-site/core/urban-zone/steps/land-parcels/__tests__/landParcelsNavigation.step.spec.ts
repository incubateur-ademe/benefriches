import type { UrbanZoneLandParcelType } from "shared";

import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - land parcels navigation", () => {
  it("should shortcut single parcel: selection → soils and spaces introduction (skipping surface distribution)", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_LAND_PARCELS_SELECTION")
      .withSiteData({ surfaceArea: 15000 })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
        answers: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] as UrbanZoneLandParcelType[] },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION");
  });

  it("should navigate multi parcel: selection → surface distribution → soils and spaces introduction", () => {
    const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_LAND_PARCELS_SELECTION").build();

    // Selection with 2 parcel types
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
        answers: {
          landParcelTypes: [
            "COMMERCIAL_ACTIVITY_AREA",
            "PUBLIC_SPACES",
          ] as UrbanZoneLandParcelType[],
        },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION");

    // Surface distribution → soils and spaces introduction
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
        answers: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 12000, PUBLIC_SPACES: 3000 } },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION");
  });

  it("should navigate back from surface distribution to selection", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_LAND_PARCELS_SELECTION",
        "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
      ])
      .withUrbanZoneSteps({
        URBAN_ZONE_LAND_PARCELS_SELECTION: {
          completed: true,
          payload: {
            landParcelTypes: [
              "COMMERCIAL_ACTIVITY_AREA",
              "PUBLIC_SPACES",
            ] as UrbanZoneLandParcelType[],
          },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_LAND_PARCELS_SELECTION");
  });
});
