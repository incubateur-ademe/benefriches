import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemorySitesService } from "../../infrastructure/sites-service/InMemorySitesService";
import { reconversionProjectCreationInitiated } from "../actions/reconversionProjectCreationInitiated.action";
import { ProjectCreationState } from "../createProject.reducer";
import { ProjectSuggestion } from "../project.types";
import { relatedSiteData } from "./siteData.mock";

describe("Reconversion project creation initialization", () => {
  it("should fetch related site data and start flow from creation mode step when reconversion project creation is initiated", async () => {
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
      projectId: expect.any(String),
      siteDataLoadingState: "success",
      siteData: relatedSiteData,
      siteRelatedLocalAuthorities: { loadingState: "idle" },
      urbanProject: expect.any(Object),
      renewableEnergyProject: expect.any(Object),
      surfaceAreaInputMode: "percentage",
      demoProject: expect.any(Object),
      useCaseSelection: {
        stepsSequence: ["USE_CASE_SELECTION_CREATION_MODE"],
        currentStep: "USE_CASE_SELECTION_CREATION_MODE",
      },
      currentProjectFlow: "USE_CASE_SELECTION",
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
      projectId: expect.any(String),
      siteDataLoadingState: "error",
      siteData: undefined,
      siteRelatedLocalAuthorities: { loadingState: "idle" },
      urbanProject: expect.any(Object),
      renewableEnergyProject: expect.any(Object),
      surfaceAreaInputMode: "percentage",
      demoProject: expect.any(Object),
      useCaseSelection: {
        stepsSequence: ["USE_CASE_SELECTION_CREATION_MODE"],
        currentStep: "USE_CASE_SELECTION_CREATION_MODE",
      },
      currentProjectFlow: "USE_CASE_SELECTION",
    });
  });

  it("should store project suggestions step when initiated with project suggestions", async () => {
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
      projectId: expect.any(String),
      siteDataLoadingState: "success",
      siteData: relatedSiteData,
      siteRelatedLocalAuthorities: { loadingState: "idle" },
      urbanProject: expect.any(Object),
      renewableEnergyProject: expect.any(Object),
      surfaceAreaInputMode: "percentage",
      demoProject: expect.any(Object),
      useCaseSelection: {
        stepsSequence: ["USE_CASE_SELECTION_CREATION_MODE"],
        currentStep: "USE_CASE_SELECTION_CREATION_MODE",
        projectSuggestions: projectSuggestions,
      },
      currentProjectFlow: "USE_CASE_SELECTION",
    });
  });
});
