import { AppDependencies, createStore, RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, SiteCreationState } from "../../createSite.reducer";
import type { UrbanZoneSiteCreationStep, UrbanZoneStepsState } from "../urbanZoneSteps";

export const getCurrentStep = (store: { getState: () => RootState }): UrbanZoneSiteCreationStep =>
  store.getState().siteCreation.urbanZone.currentStep;

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "siteCreation"> = {
    siteCreation: getInitialState(),
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withUrbanZoneSteps(steps: UrbanZoneStepsState): this {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      urbanZone: {
        ...this.preloadedRootState.siteCreation.urbanZone,
        steps,
      },
    };
    return this;
  }

  withCurrentStep(currentStep: UrbanZoneSiteCreationStep): this {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      urbanZone: {
        ...this.preloadedRootState.siteCreation.urbanZone,
        currentStep,
      },
    };
    return this;
  }

  // Also sets currentStep to the last element of the sequence.
  withStepsSequence(stepsSequence: UrbanZoneSiteCreationStep[]): this {
    const currentStep = stepsSequence.at(-1);
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      urbanZone: {
        ...this.preloadedRootState.siteCreation.urbanZone,
        stepsSequence,
        ...(currentStep && { currentStep }),
      },
    };
    return this;
  }

  withSiteData(siteData: Partial<SiteCreationState["siteData"]>): this {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      siteData: {
        ...this.preloadedRootState.siteCreation.siteData,
        ...siteData,
      },
    };
    return this;
  }

  withAppDependencies(appDependencies: Partial<AppDependencies>): this {
    this._appDependencies = getTestAppDependencies(appDependencies);
    return this;
  }

  build() {
    return createStore(this._appDependencies, this.preloadedRootState);
  }
}
