import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { updateUrbanZoneFormActions } from "@/features/update-site/core/updateSite.actions";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { siteUpdateLens } from "../siteForm.lens";
import { urbanZoneFormActions } from "./urban-zone.actions";
import {
  creationUrbanZoneFormSelectors,
  createUrbanZoneFormSelectors,
} from "./urbanZoneForm.selectors";

/**
 * Focused lens-isolation coverage (ticket 11) for the urban-zone selector bundle, mirroring the
 * same guarantee `updateSite.reducer.spec.ts` proves for the custom bundle: a second selector
 * instance built from `siteUpdateLens` reads `state.siteUpdate.urbanZone`, never creation's
 * `state.siteCreation.urbanZone` — even though both use the exact same action creators/handlers
 * under distinct prefixes. The full 17-leaf-file conversion is behaviour-preserving and is
 * otherwise covered by the existing create-side unit tests (steps/**\/*.step.spec.ts) plus the
 * e2e creation specs.
 */
describe("urban-zone selector bundle — lens isolation", () => {
  const updateUrbanZoneFormSelectors = createUrbanZoneFormSelectors(siteUpdateLens);

  it("selectManagerViewData reads only its own lens's steps", () => {
    const store = createStore(getTestAppDependencies());

    store.dispatch(
      urbanZoneFormActions.stepCompletionRequested({
        stepId: "URBAN_ZONE_MANAGER",
        answers: { structureType: "activity_park_manager" },
      }),
    );
    store.dispatch(
      updateUrbanZoneFormActions.stepCompletionRequested({
        stepId: "URBAN_ZONE_MANAGER",
        answers: {
          structureType: "local_authority",
          localAuthority: "municipality",
          localAuthorityName: "Ville de Lyon",
        },
      }),
    );

    const state = store.getState();
    expect(creationUrbanZoneFormSelectors.selectManagerViewData(state).initialValues).toEqual({
      structureType: "activity_park_manager",
      localAuthority: undefined,
      localAuthorityName: undefined,
    });
    expect(updateUrbanZoneFormSelectors.selectManagerViewData(state).initialValues).toEqual({
      structureType: "local_authority",
      localAuthority: "municipality",
      localAuthorityName: "Ville de Lyon",
    });
  });

  it("selectLandParcelsSelectionViewData reads only its own lens's steps", () => {
    const store = createStore(getTestAppDependencies());

    store.dispatch(
      urbanZoneFormActions.stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
        answers: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] },
      }),
    );
    store.dispatch(
      updateUrbanZoneFormActions.stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",
        answers: { landParcelTypes: ["PUBLIC_SPACES", "RESERVED_SURFACE"] },
      }),
    );

    const state = store.getState();
    expect(
      creationUrbanZoneFormSelectors.selectLandParcelsSelectionViewData(state).initialSelectedTypes,
    ).toEqual(["COMMERCIAL_ACTIVITY_AREA"]);
    expect(
      updateUrbanZoneFormSelectors.selectLandParcelsSelectionViewData(state).initialSelectedTypes,
    ).toEqual(["PUBLIC_SPACES", "RESERVED_SURFACE"]);
  });

  it("createParcelSoilsDistributionSelector reads only its own lens's surface distribution", () => {
    const store = createStore(getTestAppDependencies());

    store.dispatch(
      urbanZoneFormActions.stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
        answers: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 100 } },
      }),
    );
    store.dispatch(
      updateUrbanZoneFormActions.stepCompletionRequested({
        stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
        answers: { surfaceAreas: { COMMERCIAL_ACTIVITY_AREA: 200 } },
      }),
    );

    const state = store.getState();
    const creationSelector = creationUrbanZoneFormSelectors.createParcelSoilsDistributionSelector(
      "COMMERCIAL_ACTIVITY_AREA",
    );
    const updateSelector = updateUrbanZoneFormSelectors.createParcelSoilsDistributionSelector(
      "COMMERCIAL_ACTIVITY_AREA",
    );

    expect(creationSelector(state).totalSurfaceArea).toBe(100);
    expect(updateSelector(state).totalSurfaceArea).toBe(200);
  });
});
