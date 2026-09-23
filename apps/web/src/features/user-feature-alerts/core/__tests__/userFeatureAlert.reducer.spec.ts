import { createStore } from "@/app/store/store";
import { InMemoryCreateFeatureAlertService } from "@/features/user-feature-alerts/infrastructure/create-feature-alert-service/InMemoryCreateFeatureAlertService";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { featureAlertSubscribed } from "../createFeatureAlert.action";
import { loadFeatureAlerts } from "../loadFeatureAlerts.action";

describe("userFeatureAlert reducer", () => {
  it("stores the compare-impacts alert and marks it as successful when subscribing succeeds", async () => {
    const store = createStore(
      getTestAppDependencies({
        createUserFeatureAlertService: new InMemoryCreateFeatureAlertService(),
      }),
    );

    await store.dispatch(
      featureAlertSubscribed({
        email: "user@example.com",
        feature: { type: "compare_impacts", options: ["statu_quo_scenario"] },
      }),
    );

    const state = store.getState().userFeatureAlert;
    expect(state.compareImpactsAlert).toEqual({ hasAlert: true, options: ["statu_quo_scenario"] });
    expect(state.createUserFeatureAlertState.compareImpacts).toBe("success");
  });

  it("stores the update-site alert and marks it as successful when subscribing succeeds", async () => {
    const store = createStore(
      getTestAppDependencies({
        createUserFeatureAlertService: new InMemoryCreateFeatureAlertService(),
      }),
    );

    await store.dispatch(
      featureAlertSubscribed({
        email: "user@example.com",
        feature: { type: "update_site" },
      }),
    );

    const state = store.getState().userFeatureAlert;
    expect(state.updateSiteAlert).toEqual({ hasAlert: true });
    expect(state.createUserFeatureAlertState.updateSite).toBe("success");
  });

  it("marks the alert as errored and leaves it unset when the subscription service fails", async () => {
    const store = createStore(
      getTestAppDependencies({
        createUserFeatureAlertService: new InMemoryCreateFeatureAlertService(true),
      }),
    );

    await store.dispatch(
      featureAlertSubscribed({
        email: "user@example.com",
        feature: { type: "export_impacts", options: ["pdf"] },
      }),
    );

    const state = store.getState().userFeatureAlert;
    expect(state.createUserFeatureAlertState.exportImpacts).toBe("error");
    expect(state.exportImpactsAlert).toBeUndefined();
  });

  it("copies the persisted feature alerts into state without touching request statuses", async () => {
    const service = new InMemoryCreateFeatureAlertService();
    service._featureAlerts = {
      duplicateProjectAlert: { hasAlert: true },
      exportImpactsAlert: { hasAlert: true, options: ["excel"] },
    };
    const store = createStore(getTestAppDependencies({ createUserFeatureAlertService: service }));

    await store.dispatch(loadFeatureAlerts());

    const state = store.getState().userFeatureAlert;
    expect(state.duplicateProjectAlert).toEqual({ hasAlert: true });
    expect(state.exportImpactsAlert).toEqual({ hasAlert: true, options: ["excel"] });
    expect(state.createUserFeatureAlertState).toEqual({
      compareImpacts: "idle",
      duplicateProject: "idle",
      exportImpacts: "idle",
      mutafrichesAvailability: "idle",
      updateProject: "idle",
      updateSite: "idle",
    });
  });
});
