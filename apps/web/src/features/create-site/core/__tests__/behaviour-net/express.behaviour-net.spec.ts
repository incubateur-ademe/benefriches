import { Address } from "shared";

import { InMemoryCreateSiteService } from "../../../infrastructure/create-site-service/inMemoryCreateSiteApi";
import {
  selectDemoCurrentStep,
  selectDemoUseCaseContentWizardViewData,
} from "../../demo/demo.selectors";
import { nextStepRequested, stepCompletionRequested } from "../../demo/demoFactory";
import { demoSiteSaved } from "../../demo/demoSiteSaved.action";
import { siteCreationInitiated } from "../../steps/introduction/introduction.actions";
import { buildBehaviourNetStore, expressSiteId } from "./testHelpers";

// "Express" creation is, in the running app, exclusively the demo/DEMO_* engine: the site-creation
// wizard routes createMode "express" straight to the demo step content and stepper
// (SiteCreationWizard.tsx), regardless of route param ("express" or "demo"). The legacy
// createModeSelectionCompleted + expressSiteSaved pair (covered separately by
// core/steps/final/__tests__/saveSite.spec.ts) is exercised by unit tests but is not reachable
// through the wizard's own UI, so this behaviour net covers the demo engine — the path a user
// actually walks.
const ADDRESS: Address = {
  banId: "31070_p4ur8e",
  value: "Sendere 31350 Blajan",
  city: "Blajan",
  cityCode: "31070",
  postCode: "31350",
  streetName: "Sendere",
  long: 0.664699,
  lat: 43.260859,
};

describe("Site creation behaviour net — express (demo)", () => {
  it("walks a fully-answered demo wizard for a friche, asserting the current step and the exact submitted payload", async () => {
    const createSiteService = new InMemoryCreateSiteService();
    const { store, user } = buildBehaviourNetStore(createSiteService);

    store.dispatch(siteCreationInitiated({ createMode: "express" }));

    store.dispatch(nextStepRequested());
    expect(selectDemoCurrentStep(store.getState())).toEqual("DEMO_SITE_NATURE_SELECTION");

    store.dispatch(
      stepCompletionRequested({
        stepId: "DEMO_SITE_NATURE_SELECTION",
        answers: { siteNature: "FRICHE" },
      }),
    );
    expect(selectDemoCurrentStep(store.getState())).toEqual("DEMO_SITE_ACTIVITY_SELECTION");

    store.dispatch(
      stepCompletionRequested({
        stepId: "DEMO_SITE_ACTIVITY_SELECTION",
        answers: { siteNature: "FRICHE", fricheActivity: "INDUSTRY" },
      }),
    );
    expect(selectDemoCurrentStep(store.getState())).toEqual("DEMO_SITE_ADDRESS");

    store.dispatch(
      stepCompletionRequested({ stepId: "DEMO_SITE_ADDRESS", answers: { address: ADDRESS } }),
    );
    expect(selectDemoCurrentStep(store.getState())).toEqual("DEMO_SITE_SURFACE_AREA");

    store.dispatch(
      stepCompletionRequested({
        stepId: "DEMO_SITE_SURFACE_AREA",
        answers: { surfaceArea: 15000 },
      }),
    );
    expect(selectDemoCurrentStep(store.getState())).toEqual("DEMO_CREATION_RESULT");

    await store.dispatch(demoSiteSaved());

    expect(selectDemoUseCaseContentWizardViewData(store.getState()).saveState).toEqual("success");
    expect(createSiteService._expressSites).toEqual([
      {
        id: expressSiteId(store),
        createdBy: user.id,
        nature: "FRICHE",
        address: ADDRESS,
        surfaceArea: 15000,
        fricheActivity: "INDUSTRY",
      },
    ]);
  });
});
