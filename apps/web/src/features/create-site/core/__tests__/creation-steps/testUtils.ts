import { expect } from "vitest";

import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { User } from "@/features/onboarding/core/user";
import { initialState } from "@/features/onboarding/core/user.reducer";
import { AppDependencies, createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, SiteCreationStep } from "../../createSite.reducer";
import { SiteCreationData } from "../../siteFoncier.types";

export const expectNewCurrentStep = (
  initialState: RootState,
  newState: RootState,
  expectedNewCurrentStep: SiteCreationStep,
) => {
  expect(newState.siteCreation.stepsHistory).toEqual([
    ...initialState.siteCreation.stepsHistory,
    expectedNewCurrentStep,
  ]);
};

export const expectStepReverted = (initialState: RootState, newState: RootState) => {
  expect(newState.siteCreation.stepsHistory).toEqual(
    initialState.siteCreation.stepsHistory.slice(0, -1),
  );
};

export const expectSiteDataDiff = (
  initialState: RootState,
  newState: RootState,
  siteDataDiff: Partial<RootState["siteCreation"]["siteData"]>,
) => {
  expect(newState.siteCreation.siteData).toEqual({
    ...initialState.siteCreation.siteData,
    ...siteDataDiff,
  });
};

export const expectSiteDataUnchanged = (initialState: RootState, newState: RootState) => {
  expect(newState.siteCreation.siteData).toEqual(initialState.siteCreation.siteData);
};

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "siteCreation" | "currentUser" | "appSettings"> = {
    siteCreation: getInitialState(),
    currentUser: initialState,
    appSettings: { ...DEFAULT_APP_SETTINGS, askForConfirmationOnStepRevert: false },
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withStepsHistory(stepsHistory: SiteCreationStep[]) {
    // we have to use destructuring here otherwise a TypeError will occur because the original state
    // is frozen by Redux-Toolkit automatically when passed to a reducer
    // see https://github.com/reduxjs/redux-toolkit/blob/7af5345eaeab83ca57b439aec41819420c503b34/packages/toolkit/src/createReducer.ts#L156
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      stepsHistory,
    };
    return this;
  }

  withCreationData(creationData: Partial<SiteCreationData>) {
    this.preloadedRootState.siteCreation.siteData = {
      ...this.preloadedRootState.siteCreation.siteData,
      ...creationData,
    };
    return this;
  }

  withSkipUseMutability(skipUseMutability: boolean) {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      skipUseMutability,
    };
    return this;
  }

  withCreateMode(createMode: "custom" | "express") {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      createMode,
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

  withStepRevertConfirmation = (enabled: boolean = true) => {
    this.preloadedRootState.appSettings = {
      ...this.preloadedRootState.appSettings,
      askForConfirmationOnStepRevert: enabled,
    };
    return this;
  };

  withAppDependencies(appDependencies: Partial<AppDependencies>) {
    this._appDependencies = {
      ...this._appDependencies,
      ...appDependencies,
    };
    return this;
  }

  build() {
    return createStore(this._appDependencies, this.preloadedRootState);
  }
}
