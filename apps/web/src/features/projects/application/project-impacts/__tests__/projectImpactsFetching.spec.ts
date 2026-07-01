import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";

import { StoreBuilder } from ".";
import { reconversionProjectImpactsBreakEvenLevelRequested } from "../actions";
import { ProjectImpactsState } from "../projectImpacts.reducer";
import {
  urbanProjectImpactsResultDto as urbanProjectImpactMock,
  urbanProjectImpactMockMeta,
} from "./projectImpacts.mock";

describe("Project impacts fetching", () => {
  it("should successfully fetch impacts for a project without evaluation period", async () => {
    const projectId = "12345";

    const projectImpactsServiceMock = new MockReconversionProjectImpactsApi();
    projectImpactsServiceMock._setReconversionProjectImpacts({
      impacts: urbanProjectImpactMock,
      contextData: urbanProjectImpactMockMeta,
    });

    const store = new StoreBuilder()
      .withAppDependencies({ reconversionProjectImpacts: projectImpactsServiceMock })
      .build();
    const initialState = store.getState();

    expect(initialState.projectImpacts.dataLoadingState.impacts).toEqual("idle");

    await store.dispatch(reconversionProjectImpactsBreakEvenLevelRequested({ projectId }));

    const state = store.getState();
    expect(state.projectImpacts).toEqual<ProjectImpactsState>({
      dataLoadingState: {
        impacts: "success",
        urbanSprawlSimulation: "idle",
      },
      contextData: urbanProjectImpactMockMeta,
      impacts: urbanProjectImpactMock,
      evaluationPeriod: 50,
      currentViewMode: "summary",
    });
  });
});
