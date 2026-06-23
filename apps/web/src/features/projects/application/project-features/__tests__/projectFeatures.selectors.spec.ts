import { createStore, type RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectProjectFeaturesViewData } from "../projectFeatures.selectors";

describe("selectProjectFeaturesViewData", () => {
  it("returns composed view data from state", () => {
    const projectFeaturesState = {
      dataLoadingState: "success",
      data: {
        id: "project-1",
        name: "My Project",
        isExpress: false,
        developmentPlan: {
          type: "PHOTOVOLTAIC_POWER_PLANT" as const,
          electricalPowerKWc: 100,
          surfaceArea: 2000,
          expectedAnnualProduction: 120000,
          contractDuration: 20,
          installationCosts: [],
        },
        soilsDistribution: [],
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
      },
    } satisfies RootState["projectFeatures"];

    const store = createStore(getTestAppDependencies(), {
      projectFeatures: projectFeaturesState,
    });

    const viewData = selectProjectFeaturesViewData(store.getState());

    expect(viewData).toEqual({
      projectFeatures: projectFeaturesState.data,
      loadingState: "success",
    });
  });

  it("returns idle loading state and undefined features when not yet loaded", () => {
    const store = createStore(getTestAppDependencies());

    const viewData = selectProjectFeaturesViewData(store.getState());

    expect(viewData).toEqual({
      projectFeatures: undefined,
      loadingState: "idle",
    });
  });
});
