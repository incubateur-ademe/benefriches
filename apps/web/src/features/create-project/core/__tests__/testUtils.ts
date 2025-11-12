import { expect } from "vitest";

import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { User } from "@/features/onboarding/core/user";
import { initialState } from "@/features/onboarding/core/user.reducer";
import { AppDependencies, createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, ProjectCreationStep } from "../createProject.reducer";
import { ProjectSite } from "../project.types";

export const expectNewCurrentStep = (
  initialState: RootState,
  newState: RootState,
  expectedNewCurrentStep: ProjectCreationStep,
) => {
  expect(newState.projectCreation.stepsHistory).toEqual([
    ...initialState.projectCreation.stepsHistory,
    expectedNewCurrentStep,
  ]);
};

export const expectCurrentStep = (state: RootState, step: ProjectCreationStep) => {
  expect(state.projectCreation.stepsHistory.at(-1)).toEqual(step);
};

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "projectCreation" | "currentUser" | "appSettings"> = {
    projectCreation: getInitialState(),
    currentUser: initialState,
    appSettings: { ...DEFAULT_APP_SETTINGS, askForConfirmationOnStepRevert: false },
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withStepsHistory(stepsHistory: ProjectCreationStep[]) {
    // we have to use destructuring here otherwise a TypeError will occur because the original state
    // is frozen by Redux-Toolkit automatically when passed to a reducer
    // see https://github.com/reduxjs/redux-toolkit/blob/7af5345eaeab83ca57b439aec41819420c503b34/packages/toolkit/src/createReducer.ts#L156
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      stepsHistory,
    };
    return this;
  }

  withCurrentUser(user: User): this {
    this.preloadedRootState.currentUser = {
      ...this.preloadedRootState.currentUser,
      currentUser: user,
      currentUserState: "authenticated",
    };
    return this;
  }

  withAppDependencies(appDependencies: Partial<AppDependencies>) {
    this._appDependencies = {
      ...this._appDependencies,
      ...appDependencies,
    };
    return this;
  }

  withRelatedSiteData(siteData: ProjectSite): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      siteData,
    };
    return this;
  }

  build() {
    return createStore(this._appDependencies, this.preloadedRootState);
  }
}
