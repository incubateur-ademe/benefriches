import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, ProjectCreationState } from "../../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../../urban-project/creationSteps";
import { initialState as urbanProjectInitialState } from "../../urban-project/urbanProject.reducer";
import { FormEvent } from "../form-events/FormEvent.type";
import { initialState as urbanProjectEventSourcingInitialState } from "../urbanProject.reducer";
import { mockSiteData } from "./_siteData.mock";

export const createTestState = (
  options: {
    siteData?: ProjectCreationState["siteData"];
    events?: FormEvent[];
    currentStep?: UrbanProjectCustomCreationStep;
  } = {},
): ProjectCreationState => ({
  ...getInitialState(),
  urbanProjectEventSourcing: {
    ...urbanProjectEventSourcingInitialState,
    events: options.events || [],
    currentStep: options.currentStep || urbanProjectEventSourcingInitialState.currentStep,
  },
  siteData: options.siteData || mockSiteData,
  urbanProject: urbanProjectInitialState,
});

export const createTestStore = (
  options: {
    siteData?: ProjectCreationState["siteData"];
    events?: FormEvent[];
    currentStep?: UrbanProjectCustomCreationStep;
  } = {},
) => {
  const store = createStore(getTestAppDependencies(), {
    projectCreation: createTestState(options),
  });
  return store;
};
