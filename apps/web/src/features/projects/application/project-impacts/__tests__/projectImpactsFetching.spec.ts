import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";

import { StoreBuilder } from ".";
import { evaluationPeriodUpdated, reconversionProjectImpactsRequested } from "../actions";
import { urbanProjectImpactMock } from "../projectImpacts.mock";
import { ProjectImpactsState } from "../projectImpacts.reducer";

describe("Project impacts fetching", () => {
  it("should successfully fetch impacts for a project without evaluation period", async () => {
    const projectId = "12345";

    const projectImpactsServiceMock = new MockReconversionProjectImpactsApi();
    projectImpactsServiceMock._setReconversionProjectImpacts({
      ...urbanProjectImpactMock,
      evaluationPeriodInYears: 50,
    });

    const store = new StoreBuilder()
      .withAppDependencies({ reconversionProjectImpacts: projectImpactsServiceMock })
      .build();
    const initialState = store.getState();

    expect(initialState.projectImpacts.dataLoadingState).toEqual("idle");

    await store.dispatch(reconversionProjectImpactsRequested({ projectId }));

    const state = store.getState();
    expect(state.projectImpacts).toEqual<ProjectImpactsState>({
      dataLoadingState: "success",
      projectData: {
        id: urbanProjectImpactMock.id,
        name: urbanProjectImpactMock.name,
        ...urbanProjectImpactMock.projectData,
      },
      relatedSiteData: {
        id: urbanProjectImpactMock.relatedSiteId,
        name: urbanProjectImpactMock.relatedSiteName,
        isExpressSite: urbanProjectImpactMock.isExpressSite,
        ...urbanProjectImpactMock.siteData,
      },
      impactsData: urbanProjectImpactMock.impacts,
      evaluationPeriod: 50,
      currentViewMode: "summary",
    });
  });

  it("should successfully fetch impacts for a project when evaluation period is updated", async () => {
    const newEvaluationPeriod = 25;
    const projectImpactsServiceMock = new MockReconversionProjectImpactsApi();
    projectImpactsServiceMock._setReconversionProjectImpacts({
      ...urbanProjectImpactMock,
      evaluationPeriodInYears: newEvaluationPeriod,
    });

    const store = new StoreBuilder()
      .withEvaluationPeriod(50)
      .withImpactsData({
        ...urbanProjectImpactMock.impacts,
        economicBalance: { ...urbanProjectImpactMock.impacts.economicBalance, total: 999999 },
      })
      .withAppDependencies({ reconversionProjectImpacts: projectImpactsServiceMock })
      .build();
    const initialState = store.getState();

    expect(initialState.projectImpacts.dataLoadingState).toEqual("idle");

    // update evaluation period
    await store.dispatch(evaluationPeriodUpdated({ evaluationPeriodInYears: newEvaluationPeriod }));

    const state = store.getState();
    expect(state.projectImpacts).toEqual<ProjectImpactsState>({
      dataLoadingState: "success",
      projectData: {
        id: urbanProjectImpactMock.id,
        name: urbanProjectImpactMock.name,
        ...urbanProjectImpactMock.projectData,
      },
      relatedSiteData: {
        id: urbanProjectImpactMock.relatedSiteId,
        name: urbanProjectImpactMock.relatedSiteName,
        isExpressSite: urbanProjectImpactMock.isExpressSite,
        ...urbanProjectImpactMock.siteData,
      },
      impactsData: urbanProjectImpactMock.impacts,
      evaluationPeriod: newEvaluationPeriod,
      currentViewMode: "summary",
    });
  });
});
