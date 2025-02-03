import { UrbanSpaceCategory } from "shared";

import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import { getInitialState } from "../../createProject.reducer";
import { UrbanProjectCreationData } from "../creationData";
import { UrbanProjectCreationStep } from "../creationSteps";

export const expectCurrentStep = (state: RootState, step: UrbanProjectCreationStep) => {
  expect(state.projectCreation.urbanProject.stepsHistory).toEqual([step]);
};

type UpdatedStateAssertionInput = {
  creationDataDiff?: Partial<UrbanProjectCreationData>;
  currentStep: UrbanProjectCreationStep;
  spacesCategoriesToComplete?: RootState["projectCreation"]["urbanProject"]["spacesCategoriesToComplete"];
};
export const expectUpdatedState = (
  initialState: RootState,
  updatedState: RootState,
  { creationDataDiff = {}, spacesCategoriesToComplete, currentStep }: UpdatedStateAssertionInput,
) => {
  const initialUrbanProjectState = initialState.projectCreation.urbanProject;
  const updatedUrbanProjectState = updatedState.projectCreation.urbanProject;
  expect(updatedUrbanProjectState).toEqual({
    ...initialUrbanProjectState,
    stepsHistory: [...initialState.projectCreation.urbanProject.stepsHistory, currentStep],
    spacesCategoriesToComplete:
      spacesCategoriesToComplete ?? initialUrbanProjectState.spacesCategoriesToComplete,
    creationData: {
      ...initialUrbanProjectState.creationData,
      ...creationDataDiff,
    },
  });
};

export const expectRevertedState = (
  initialState: RootState,
  updatedState: RootState,
  {
    creationDataDiff = {},
    spacesCategoriesToComplete,
  }: Omit<UpdatedStateAssertionInput, "currentStep">,
) => {
  const initialUrbanProjectState = initialState.projectCreation.urbanProject;
  const updatedUrbanProjectState = updatedState.projectCreation.urbanProject;
  expect(updatedUrbanProjectState).toEqual({
    ...initialUrbanProjectState,
    stepsHistory: initialState.projectCreation.urbanProject.stepsHistory.slice(0, -1),
    spacesCategoriesToComplete:
      spacesCategoriesToComplete ?? initialUrbanProjectState.spacesCategoriesToComplete,
    creationData: {
      ...initialUrbanProjectState.creationData,
      ...creationDataDiff,
    },
  });
};

export class StoreBuilder {
  preloadedRootState = {
    projectCreation: getInitialState(),
    appSettings: DEFAULT_APP_SETTINGS,
  };

  withSiteData(siteData: Partial<RootState["projectCreation"]["siteData"]>) {
    this.preloadedRootState.projectCreation.siteData = {
      ...relatedSiteData,
      ...siteData,
    };
    return this;
  }

  withStepsHistory(stepsHistory: UrbanProjectCreationStep[]) {
    // we have to use destructuring here otherwise a TypeError will occur because the original state
    // is frozen by Redux-Toolkit automatically when passed to a reducer
    // see https://github.com/reduxjs/redux-toolkit/blob/7af5345eaeab83ca57b439aec41819420c503b34/packages/toolkit/src/createReducer.ts#L156
    this.preloadedRootState.projectCreation.urbanProject = {
      ...this.preloadedRootState.projectCreation.urbanProject,
      stepsHistory,
    };
    return this;
  }

  withSpacesCategoriesToComplete(spaceCategories: UrbanSpaceCategory[]) {
    this.preloadedRootState.projectCreation.urbanProject = {
      ...this.preloadedRootState.projectCreation.urbanProject,
      spacesCategoriesToComplete: spaceCategories,
    };
    return this;
  }

  withCreationData(creationData: UrbanProjectCreationData) {
    this.preloadedRootState.projectCreation.urbanProject = {
      ...this.preloadedRootState.projectCreation.urbanProject,
      creationData,
    };
    return this;
  }

  withAppSettingInputMode = (inputMode: "percentage" | "squareMeters") => {
    this.preloadedRootState.appSettings = {
      ...this.preloadedRootState.appSettings,
      surfaceAreaInputMode: inputMode,
    };
    return this;
  };

  build() {
    return createStore(getTestAppDependencies(), this.preloadedRootState);
  }
}
