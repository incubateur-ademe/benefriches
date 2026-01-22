import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, ProjectCreationState } from "../../createProject.reducer";
import { mockSiteData } from "./_siteData.mock";

export const getCurrentStep = (store: { getState: () => RootState }): UrbanProjectCreationStep =>
  store.getState().projectCreation.urbanProject.currentStep;

const createTestState = (
  options: {
    siteData?: ProjectCreationState["siteData"];
    steps?: ProjectCreationState["urbanProject"]["steps"];
    currentStep?: UrbanProjectCreationStep;
  } = {},
): ProjectCreationState => ({
  ...getInitialState(),
  urbanProject: {
    ...getInitialState().urbanProject,
    steps: options.steps || {},
    currentStep: options.currentStep || getInitialState().urbanProject.currentStep,
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
