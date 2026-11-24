import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { MockProjectFeaturesService } from "../../../infrastructure/project-features-service/MockProjectFeaturesService";
import { fetchProjectFeatures } from "../projectFeatures.actions";
import { selectProjectFeatures } from "../projectFeatures.reducer";

describe("fetchProjectFeatures", () => {
  it("returns the latest features when the project was already loaded and then updated", async () => {
    const projectFeaturesService = new MockProjectFeaturesService();
    const projectId = projectFeaturesService.projectFeatures.id;
    const store = createStore(getTestAppDependencies({ projectFeaturesService }));

    projectFeaturesService._setProjectFeatures({
      ...projectFeaturesService.projectFeatures,
      financialAssistanceRevenues: [{ amount: 400000, source: "other" }],
    });
    await store.dispatch(fetchProjectFeatures({ projectId }));

    // the project is saved with a new amount, then its features are requested again
    projectFeaturesService._setProjectFeatures({
      ...projectFeaturesService.projectFeatures,
      financialAssistanceRevenues: [{ amount: 450000, source: "other" }],
    });
    await store.dispatch(fetchProjectFeatures({ projectId }));

    expect(selectProjectFeatures(store.getState())?.financialAssistanceRevenues).toEqual([
      { amount: 450000, source: "other" },
    ]);
  });
});
