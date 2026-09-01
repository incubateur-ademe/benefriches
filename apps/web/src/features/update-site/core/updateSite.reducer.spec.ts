import type { GetSiteFeaturesResponseDto } from "shared";
import { describe, expect, it } from "vitest";

import { createStore } from "@/app/store/store";
import { customFormActions } from "@/features/create-site/core/custom/custom.actions";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryUpdateSiteService } from "../infrastructure/update-site-service/InMemoryUpdateSiteService";
import {
  updateCustomFormActions,
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
});
