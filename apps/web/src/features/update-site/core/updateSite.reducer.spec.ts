import type { GetSiteFeaturesResponseDto } from "shared";
import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { customFormActions } from "@/features/create-site/core/custom/custom.actions";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryUpdateSiteService } from "../infrastructure/update-site-service/InMemoryUpdateSiteService";
import {
  updateCustomFormActions,
  updateUrbanZoneFormActions,
  siteUpdateInitiated,
  siteUpdateSaved,
} from "./updateSite.actions";
import updateSiteReducer from "./updateSite.reducer";

const FRICHE_FEATURES: GetSiteFeaturesResponseDto = {
  id: "site-1",
  name: "Friche Duchamp",
  description: "Une friche industrielle",
  nature: "FRICHE",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner Corp" },
  soilsDistribution: { BUILDINGS: 4000, IMPERMEABLE_SOILS: 6000 },
  surfaceArea: 10000,
  address: {
    banId: "addr-1",
    city: "Paris",
    cityCode: "75056",
    postCode: "75001",
    streetName: "Rue de Paris",
    streetNumber: "1",
    value: "1 Rue de Paris, 75001 Paris",
    long: 2.35,
    lat: 48.85,
  },
  yearlyExpenses: [{ amount: 3000, purpose: "security", bearer: "tenant" }],
  yearlyIncomes: [],
  fricheActivity: "INDUSTRY",
  hasContaminatedSoils: false,
};

describe("updateSite reducer", () => {
  it("lands on FINAL_SUMMARY with a non-empty stepsSequence and an idle saveState after hydration", () => {
    const state = updateSiteReducer(
      undefined,
      siteUpdateInitiated.fulfilled(
        { features: FRICHE_FEATURES, isEditable: true, notEditableReason: null },
        "requestId",
        "site-1",
      ),
    );

    expect(state.custom.currentStep).toBe("FINAL_SUMMARY");
    expect(state.custom.stepsSequence.length).toBeGreaterThan(0);
    expect(state.custom.saveState).toBe("idle");
    expect(state.siteId).toBe("site-1");
  });

  it("moves currentStep via stepNavigationRequested without touching any answer", () => {
    const hydrated = updateSiteReducer(
      undefined,
      siteUpdateInitiated.fulfilled(
        { features: FRICHE_FEATURES, isEditable: true, notEditableReason: null },
        "requestId",
        "site-1",
      ),
    );
    const stepsBefore = hydrated.custom.steps;

    const state = updateSiteReducer(
      hydrated,
      updateCustomFormActions.stepNavigationRequested({ stepId: "NAMING" }),
    );

    expect(state.custom.currentStep).toBe("NAMING");
    expect(state.custom.steps).toEqual(stepsBefore);
  });

  it("records isEditable/notEditableReason without hydrating a wizard when the site is not editable", () => {
    const state = updateSiteReducer(
      undefined,
      siteUpdateInitiated.fulfilled(
        { features: FRICHE_FEATURES, isEditable: false, notEditableReason: "NOT_CREATOR" },
        "requestId",
        "site-1",
      ),
    );

    expect(state.isEditable).toBe(false);
    expect(state.notEditableReason).toBe("NOT_CREATOR");
  });

  it("keeps state.siteCreation untouched when dispatching the update-prefixed action", () => {
    // Exercised through the store (both slices live side by side there) to prove prefix
    // isolation end-to-end, not just at the pure-reducer level.
    const store = createStore(getTestAppDependencies());
    const beforeCreationStep = store.getState().siteCreation.custom.currentStep;

    store.dispatch(updateCustomFormActions.stepNavigationRequested({ stepId: "NAMING" }));

    expect(store.getState().siteCreation.custom.currentStep).toBe(beforeCreationStep);
  });

  it("keeps state.siteUpdate untouched when dispatching the creation-prefixed action", () => {
    const store = createStore(getTestAppDependencies());
    const beforeUpdateStep = store.getState().siteUpdate.custom.currentStep;

    store.dispatch(customFormActions.stepNavigationRequested({ stepId: "NAMING" }));

    expect(store.getState().siteUpdate.custom.currentStep).toBe(beforeUpdateStep);
  });

  it("completing one step then saving sends a payload where only that answer changed", async () => {
    const updateSiteService = new InMemoryUpdateSiteService();
    updateSiteService._siteView = {
      features: FRICHE_FEATURES,
      isEditable: true,
      notEditableReason: null,
    };
    const store = createStore(getTestAppDependencies({ updateSiteService }));

    await store.dispatch(siteUpdateInitiated("site-1"));
    store.dispatch(
      updateCustomFormActions.stepCompletionRequested({
        stepId: "NAMING",
        answers: { name: "Nouveau nom", description: "Une friche industrielle" },
      }),
    );
    await store.dispatch(siteUpdateSaved());

    expect(updateSiteService._savedPayloads).toHaveLength(1);
    const saved = updateSiteService._savedPayloads[0]!;
    expect(saved.siteId).toBe("site-1");
    expect(saved.payload.name).toBe("Nouveau nom");
    // Untouched fields survive the save unchanged.
    expect(saved.payload.address).toEqual(FRICHE_FEATURES.address);
    expect(saved.payload.owner).toEqual({ structureType: "company", name: "Owner Corp" });
    expect(saved.payload.nature).toBe("FRICHE");
    if (saved.payload.nature !== "FRICHE") throw new Error("expected a friche payload");
    expect(saved.payload.soilsDistribution).toEqual(FRICHE_FEATURES.soilsDistribution);
  });

  describe("URBAN_ZONE (two-engine flow)", () => {
    const URBAN_ZONE_FEATURES: GetSiteFeaturesResponseDto = {
      id: "site-uz-1",
      name: "Zone Nord",
      nature: "URBAN_ZONE",
      isExpressSite: false,
      owner: { structureType: "company", name: "Owner Corp" },
      soilsDistribution: {},
      surfaceArea: 10000,
      address: FRICHE_FEATURES.address,
      yearlyExpenses: [],
      yearlyIncomes: [],
      urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
      landParcels: [
        {
          type: "COMMERCIAL_ACTIVITY_AREA",
          surfaceArea: 10000,
          soilsDistribution: { IMPERMEABLE_SOILS: 10000 },
        },
      ],
      manager: { structureType: "activity_park_manager", name: "" },
      vacantCommercialPremisesFootprint: 0,
      fullTimeJobsEquivalent: 5,
    };

    it("sets customHandedOffToUrbanZone, hydrates urbanZone.steps and lands on URBAN_ZONE_FINAL_SUMMARY with a non-empty sequence", () => {
      const state = updateSiteReducer(
        undefined,
        siteUpdateInitiated.fulfilled(
          { features: URBAN_ZONE_FEATURES, isEditable: true, notEditableReason: null },
          "requestId",
          "site-uz-1",
        ),
      );

      expect(state.customHandedOffToUrbanZone).toBe(true);
      expect(state.urbanZone.currentStep).toBe("URBAN_ZONE_FINAL_SUMMARY");
      expect(state.urbanZone.stepsSequence.length).toBeGreaterThan(0);
      expect(state.urbanZone.steps.URBAN_ZONE_LAND_PARCELS_SELECTION).toEqual({
        completed: true,
        payload: { landParcelTypes: ["COMMERCIAL_ACTIVITY_AREA"] },
      });
      // The custom half is hydrated too, so ADDRESS/SURFACE_AREA/URBAN_ZONE_TYPE stay reachable.
      expect(state.custom.steps.ADDRESS).toEqual({
        completed: true,
        payload: { address: URBAN_ZONE_FEATURES.address },
      });
    });

    it("hands control back to the custom engine when navigating to one of its steps from the urban-zone summary (📍 Localisation Modifier)", () => {
      const hydrated = updateSiteReducer(
        undefined,
        siteUpdateInitiated.fulfilled(
          { features: URBAN_ZONE_FEATURES, isEditable: true, notEditableReason: null },
          "requestId",
          "site-uz-1",
        ),
      );
      expect(hydrated.customHandedOffToUrbanZone).toBe(true);

      const navigated = updateSiteReducer(
        hydrated,
        updateCustomFormActions.stepNavigationRequested({ stepId: "ADDRESS" }),
      );

      expect(navigated.customHandedOffToUrbanZone).toBe(false);
      expect(navigated.custom.currentStep).toBe("ADDRESS");
    });

    it("navigating to a per-parcel soils step then completing it updates only that answer and stays within its stepper group (groupOf)", () => {
      const hydrated = updateSiteReducer(
        undefined,
        siteUpdateInitiated.fulfilled(
          { features: URBAN_ZONE_FEATURES, isEditable: true, notEditableReason: null },
          "requestId",
          "site-uz-1",
        ),
      );

      const navigated = updateSiteReducer(
        hydrated,
        updateUrbanZoneFormActions.stepNavigationRequested({
          stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
        }),
      );
      expect(navigated.urbanZone.currentStep).toBe(
        "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
      );

      const completed = updateSiteReducer(
        navigated,
        updateUrbanZoneFormActions.stepCompletionRequested({
          stepId: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
          answers: { soilsDistribution: { MINERAL_SOIL: 10000 } },
        }),
      );

      // The single parcel's own next step (URBAN_ZONE_SOILS_SUMMARY) sits in the same
      // SOILS_AND_SPACES stepper group as the step just completed — `groupOf` follows it
      // (step_order-like) rather than collapsing to `next_empty`'s "first incomplete answer
      // step" search, which on a fully-hydrated form would otherwise snap straight back to the
      // final summary (ticket 10's QA defect 3, guarded against here for urban zone).
      expect(completed.urbanZone.currentStep).toBe("URBAN_ZONE_SOILS_SUMMARY");
      expect(
        completed.urbanZone.steps.URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION,
      ).toEqual({
        completed: true,
        payload: { soilsDistribution: { MINERAL_SOIL: 10000 } },
        // `defaultValues` isn't refreshed by completion (only `payload` is, see
        // `MutateStateHelper.completeStep`) — it stays at whatever hydration pre-filled the form
        // with when the step was first entered.
        defaultValues: { soilsDistribution: { IMPERMEABLE_SOILS: 10000 } },
      });
      // Untouched answers survive.
      expect(completed.urbanZone.steps.URBAN_ZONE_MANAGER).toEqual(
        hydrated.urbanZone.steps.URBAN_ZONE_MANAGER,
      );
    });

    it("completing the (already-completed) NAMING step on a fully-hydrated form returns to the summary (next_empty)", () => {
      const hydrated = updateSiteReducer(
        undefined,
        siteUpdateInitiated.fulfilled(
          { features: URBAN_ZONE_FEATURES, isEditable: true, notEditableReason: null },
          "requestId",
          "site-uz-1",
        ),
      );

      const navigated = updateSiteReducer(
        hydrated,
        updateUrbanZoneFormActions.stepNavigationRequested({ stepId: "URBAN_ZONE_NAMING" }),
      );

      const completed = updateSiteReducer(
        navigated,
        updateUrbanZoneFormActions.stepCompletionRequested({
          stepId: "URBAN_ZONE_NAMING",
          answers: { name: "Nouveau nom de zone", description: undefined },
        }),
      );

      // NAMING's own next step (URBAN_ZONE_FINAL_SUMMARY) is in a different group (SUMMARY) —
      // groupOf does not apply, and every other answer step is already completed, so next_empty
      // lands on the summary.
      expect(completed.urbanZone.currentStep).toBe("URBAN_ZONE_FINAL_SUMMARY");
      expect(completed.urbanZone.steps.URBAN_ZONE_NAMING).toEqual({
        completed: true,
        payload: { name: "Nouveau nom de zone", description: undefined },
      });
    });

    it("does not mutate state.custom when dispatching an urban-zone update action", () => {
      const hydrated = updateSiteReducer(
        undefined,
        siteUpdateInitiated.fulfilled(
          { features: URBAN_ZONE_FEATURES, isEditable: true, notEditableReason: null },
          "requestId",
          "site-uz-1",
        ),
      );
      const customBefore = hydrated.custom;

      const state = updateSiteReducer(
        hydrated,
        updateUrbanZoneFormActions.stepNavigationRequested({
          stepId: "URBAN_ZONE_MANAGER",
        }),
      );

      expect(state.custom).toEqual(customBefore);
    });

    it("sets both custom and urbanZone saveState on siteUpdateSaved.pending/fulfilled/rejected", () => {
      const hydrated = updateSiteReducer(
        undefined,
        siteUpdateInitiated.fulfilled(
          { features: URBAN_ZONE_FEATURES, isEditable: true, notEditableReason: null },
          "requestId",
          "site-uz-1",
        ),
      );

      const pending = updateSiteReducer(hydrated, siteUpdateSaved.pending("reqId", undefined));
      expect(pending.urbanZone.saveState).toBe("loading");
      expect(pending.custom.saveState).toBe("loading");

      const fulfilled = updateSiteReducer(
        pending,
        siteUpdateSaved.fulfilled(undefined, "reqId", undefined),
      );
      expect(fulfilled.urbanZone.saveState).toBe("success");
      expect(fulfilled.custom.saveState).toBe("success");

      const rejected = updateSiteReducer(
        pending,
        siteUpdateSaved.rejected(new Error("failed"), "reqId", undefined),
      );
      expect(rejected.urbanZone.saveState).toBe("error");
      expect(rejected.custom.saveState).toBe("error");
    });
  });
});
