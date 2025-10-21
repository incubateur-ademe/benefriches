import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, ProjectCreationState } from "../../createProject.reducer";
import { urbanProjectInitialState } from "../urbanProject.reducer";
import { mockSiteData } from "./_siteData.mock";

const createTestState = (
  options: {
    siteData?: ProjectCreationState["siteData"];
    steps?: ProjectCreationState["urbanProject"]["steps"];
    currentStep?: UrbanProjectCreationStep;
  } = {},
): ProjectCreationState => ({
  ...getInitialState(),
  urbanProject: {
    ...urbanProjectInitialState,
    steps: options.steps || {},
    currentStep: options.currentStep || urbanProjectInitialState.currentStep,
  },
  siteData: options.siteData || mockSiteData,
});

export const createTestStore = (
  options: {
    siteData?: ProjectCreationState["siteData"];
    steps?: ProjectCreationState["urbanProject"]["steps"];
    currentStep?: UrbanProjectCreationStep;
  } = {},
) => {
  const store = createStore(getTestAppDependencies(), {
    projectCreation: createTestState(options),
  });
  return store;
};
