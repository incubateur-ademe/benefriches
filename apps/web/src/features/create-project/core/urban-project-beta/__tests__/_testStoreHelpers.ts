import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, ProjectCreationState } from "../../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../../urban-project/creationSteps";
import { initialState as urbanProjectInitialState } from "../../urban-project/urbanProject.reducer";
import { initialState as urbanProjectBetaInitialState } from "../urbanProject.reducer";
import { mockSiteData } from "./_siteData.mock";

const createTestState = (
  options: {
    siteData?: ProjectCreationState["siteData"];
    steps?: ProjectCreationState["urbanProjectBeta"]["steps"];
    currentStep?: UrbanProjectCustomCreationStep;
  } = {},
): ProjectCreationState => ({
  ...getInitialState(),
  urbanProjectBeta: {
    ...urbanProjectBetaInitialState,
    steps: options.steps || {},
    currentStep: options.currentStep || urbanProjectBetaInitialState.currentStep,
  },
  siteData: options.siteData || mockSiteData,
  urbanProject: urbanProjectInitialState,
});

export const createTestStore = (
  options: {
    siteData?: ProjectCreationState["siteData"];
    steps?: ProjectCreationState["urbanProjectBeta"]["steps"];
    currentStep?: UrbanProjectCustomCreationStep;
  } = {},
) => {
  const store = createStore(getTestAppDependencies(), {
    projectCreation: createTestState(options),
  });
  return store;
};
