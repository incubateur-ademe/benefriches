import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemorySitesService } from "../../infrastructure/sites-service/InMemorySitesService";
import { reconversionProjectCreationInitiated } from "../actions/reconversionProjectCreationInitiated.action";
import { ProjectCreationState } from "../createProject.reducer";
import { ProjectSuggestion } from "../project.types";
import { relatedSiteData } from "./siteData.mock";

describe("Reconversion project creation initialization", () => {
  it("should fetch related site data and start flow from introduction step when reconversion project creation is initiated", async () => {
    const fakeSiteService = new InMemorySitesService([relatedSiteData]);
    const store = createStore(
      getTestAppDependencies({
        getSiteByIdService: fakeSiteService,
      }),
    );

    await store.dispatch(
      reconversionProjectCreationInitiated({ relatedSiteId: relatedSiteData.id }),
    );

    const projectCreationState = store.getState().projectCreation;
    expect(projectCreationState).toEqual<ProjectCreationState>({
      stepsHistory: ["INTRODUCTION"],
      projectId: expect.any(String),
      developmentPlanCategory: undefined,
      stepRevertAttempted: false,
      projectSuggestions: undefined,
      siteDataLoadingState: "success",
      siteData: relatedSiteData,
      siteRelatedLocalAuthorities: { loadingState: "idle" },
      urbanProject: expect.any(Object),
      renewableEnergyProject: expect.any(Object),
    });
  });

  it("should be in error state when site fetching fails on reconversion project creation initialization", async () => {
    const fakeSiteService = new InMemorySitesService([relatedSiteData]);
    const store = createStore(
      getTestAppDependencies({
        getSiteByIdService: fakeSiteService,
      }),
    );

    await store.dispatch(
      reconversionProjectCreationInitiated({ relatedSiteId: "non-existing-id" }),
    );

    const projectCreationState = store.getState().projectCreation;
    expect(projectCreationState).toEqual<ProjectCreationState>({
      stepsHistory: ["INTRODUCTION"],
      projectId: expect.any(String),
      developmentPlanCategory: undefined,
      stepRevertAttempted: false,
      projectSuggestions: undefined,
      siteDataLoadingState: "error",
      siteData: undefined,
      siteRelatedLocalAuthorities: { loadingState: "idle" },
      urbanProject: expect.any(Object),
      renewableEnergyProject: expect.any(Object),
    });
  });

  it("should start from project suggestions step when initiated with project suggestions", async () => {
    const fakeSiteService = new InMemorySitesService([relatedSiteData]);
    const store = createStore(
      getTestAppDependencies({
        getSiteByIdService: fakeSiteService,
      }),
    );

    const projectSuggestions: ProjectSuggestion[] = [
      { type: "RESIDENTIAL_NORMAL_AREA", compatibilityScore: 85 },
      { type: "INDUSTRIAL_FACILITIES", compatibilityScore: 70 },
      { type: "OFFICES", compatibilityScore: 54 },
    ];

    await store.dispatch(
      reconversionProjectCreationInitiated({
        relatedSiteId: relatedSiteData.id,
        projectSuggestions: projectSuggestions,
      }),
    );

    expect(store.getState().projectCreation).toEqual<ProjectCreationState>({
      stepsHistory: ["PROJECT_SUGGESTIONS"],
      projectId: expect.any(String),
      developmentPlanCategory: undefined,
      stepRevertAttempted: false,
      projectSuggestions,
      siteDataLoadingState: "success",
      siteData: relatedSiteData,
      siteRelatedLocalAuthorities: { loadingState: "idle" },
      urbanProject: expect.any(Object),
      renewableEnergyProject: expect.any(Object),
    });
  });
});
