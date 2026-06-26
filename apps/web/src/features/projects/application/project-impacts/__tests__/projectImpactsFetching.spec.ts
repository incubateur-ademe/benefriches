import { MockReconversionProjectImpactsApi } from "@/features/projects/infrastructure/reconversion-project-impacts-service/MockReconversionProjectImpactsService";

import { StoreBuilder } from ".";
import {
  reconversionProjectImpactsBreakEvenLevelRequested,
  reconversionProjectImpactsRequested,
} from "../actions";
import { ProjectImpactsState } from "../projectImpacts.reducer";
import {
  urbanProjectImpactsResultDto as urbanProjectImpactMock,
  urbanProjectImpactMockMeta,
} from "./projectImpacts.mock";

describe("Project impacts fetching", () => {
  it("should successfully fetch impacts for a project without evaluation period", async () => {
    const projectId = "12345";

    const projectImpactsServiceMock = new MockReconversionProjectImpactsApi();
    projectImpactsServiceMock._setReconversionProjectImpactsBreakEvenLevel(urbanProjectImpactMock);
    projectImpactsServiceMock._setReconversionProjectImpacts({
      ...urbanProjectImpactMockMeta,
      impacts: {
        economicBalance: { total: 0, costs: { total: 0 }, revenues: { total: 0 } },
        environmental: {
          permeableSurfaceArea: {
            base: 0,
            forecast: 0,
            difference: 0,
            mineralSoil: { base: 0, forecast: 0, difference: 0 },
            greenSoil: { base: 0, forecast: 0, difference: 0 },
          },
        },
        socioeconomic: { total: 0, impacts: [] },
        social: {},
      },
    });
    const store = new StoreBuilder()
      .withAppDependencies({ reconversionProjectImpacts: projectImpactsServiceMock })
      .build();
    const initialState = store.getState();

    expect(initialState.projectImpacts.dataLoadingState.oldProjectImpacts).toEqual("idle");

    await store.dispatch(reconversionProjectImpactsRequested({ projectId }));
    await store.dispatch(reconversionProjectImpactsBreakEvenLevelRequested({ projectId }));

    const state = store.getState();
    expect(state.projectImpacts).toEqual<ProjectImpactsState>({
      dataLoadingState: {
        oldProjectImpacts: "success",
        impacts: "success",
        urbanSprawlSimulation: "idle",
      },
      projectData: {
        id: urbanProjectImpactMockMeta.id,
        name: urbanProjectImpactMockMeta.name,
        ...urbanProjectImpactMockMeta.projectData,
      },
      relatedSiteData: {
        id: urbanProjectImpactMockMeta.relatedSiteId,
        name: urbanProjectImpactMockMeta.relatedSiteName,
        isExpressSite: urbanProjectImpactMockMeta.isExpressSite,
        ...urbanProjectImpactMockMeta.siteData,
      },
      impacts: urbanProjectImpactMock,
      evaluationPeriod: 50,
      currentViewMode: "summary",
    });
  });
});
