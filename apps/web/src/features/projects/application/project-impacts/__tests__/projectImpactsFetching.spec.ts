import {
  urbanProjectDevelopmentScoreMock,
  urbanProjectImpactsResultDto as urbanProjectImpactMock,
  urbanProjectImpactMockMeta,
} from "shared";

import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";

import { StoreBuilder } from ".";
import { reconversionProjectImpactsAnalysisRequested } from "../actions";
import type { ProjectImpactsState } from "../projectImpacts.reducer";

describe("Project impacts fetching", () => {
  it("should successfully fetch impacts for a project without evaluation period", async () => {
    const projectId = "12345";

    const projectImpactsServiceMock = new MockReconversionProjectImpactsApi();
    projectImpactsServiceMock._setReconversionProjectImpacts({
      impacts: urbanProjectImpactMock,
      contextData: urbanProjectImpactMockMeta,
      developmentScore: urbanProjectDevelopmentScoreMock,
    });

    const store = new StoreBuilder()
      .withAppDependencies({ reconversionProjectImpacts: projectImpactsServiceMock })
      .build();
    const initialState = store.getState();

    expect(initialState.projectImpacts.dataLoadingState.impacts).toEqual("idle");

    await store.dispatch(reconversionProjectImpactsAnalysisRequested({ projectId }));

    const state = store.getState();
    expect(state.projectImpacts).toEqual<ProjectImpactsState>({
      dataLoadingState: {
        impacts: "success",
        urbanSprawlSimulation: "idle",
      },
      contextData: urbanProjectImpactMockMeta,
      impacts: urbanProjectImpactMock,
      developmentScore: urbanProjectDevelopmentScoreMock,
      evaluationPeriod: 50,
    });
  });

  it("should be in notFound state when the project does not exist", async () => {
    const projectImpactsServiceMock = new MockReconversionProjectImpactsApi();
    projectImpactsServiceMock._setReconversionProjectNotFound();

    const store = new StoreBuilder()
      .withAppDependencies({ reconversionProjectImpacts: projectImpactsServiceMock })
      .build();

    await store.dispatch(
      reconversionProjectImpactsAnalysisRequested({ projectId: "unknown-project-id" }),
    );

    const state = store.getState();
    expect(state.projectImpacts).toEqual<ProjectImpactsState>({
      dataLoadingState: {
        impacts: "notFound",
        urbanSprawlSimulation: "idle",
      },
      evaluationPeriod: undefined,
      contextData: undefined,
    });
  });
});
