import { expect } from "vitest";

import { AppDependencies, createStore, RootState } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { User } from "@/features/onboarding/core/user";
import { initialState } from "@/features/onboarding/core/user.reducer";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  getInitialState,
  selectCurrentStep,
  SiteCreationState,
  SiteCreationStep,
} from "../../createSite.reducer";
import type { CustomStepsState, SiteCreationCustomStep } from "../../custom/customSteps";
import { SiteCreationData } from "../../siteFoncier.types";
import type {
  UrbanZoneSiteCreationStep,
  UrbanZoneStepsState,
} from "../../urban-zone/urbanZoneSteps";

/** Asserts the step the store resolves to via the same public selector the app itself reads. */
export const expectCurrentStep = (
  store: { getState: () => RootState },
  expectedStep: SiteCreationStep,
) => {
  expect(selectCurrentStep(store.getState())).toEqual(expectedStep);
};

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "siteCreation" | "currentUser" | "appSettings"> &
    Partial<Pick<RootState, "siteMunicipalityData">> = {
    siteCreation: getInitialState({ createMode: "custom" }),
    currentUser: initialState,
    appSettings: { ...DEFAULT_APP_SETTINGS, askForConfirmationOnStepRevert: false },
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withCityPopulation(population: number) {
    this.preloadedRootState.siteMunicipalityData = {
      ...this.preloadedRootState.siteMunicipalityData,
      loadingState: "success",
      population,
    };
    return this;
  }

  withCityIsRural(isRural: boolean) {
    this.preloadedRootState.siteMunicipalityData = {
      ...this.preloadedRootState.siteMunicipalityData,
      loadingState: "success",
      isRural,
    };
    return this;
  }

  /** Seeds the pre-engine steps history (INTRODUCTION/IS_FRICHE/USE_MUTABILITY/SITE_NATURE/CREATE_MODE_SELECTION only). */
  withStepsHistory(stepsHistory: SiteCreationStep[]) {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      stepsHistory,
    };
    return this;
  }

  /** Seeds the custom engine as already started, on the given step, with the given answers. */
  withCustomStep(currentStep: SiteCreationCustomStep, steps: CustomStepsState = {}) {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      createMode: "custom",
      customFlowStarted: true,
      custom: {
        ...this.preloadedRootState.siteCreation.custom,
        currentStep,
        firstSequenceStep: currentStep,
        steps: { ...this.preloadedRootState.siteCreation.custom.steps, ...steps },
      },
    };
    return this;
  }

  withIsFriche(isFriche: boolean) {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      isFriche,
    };
    return this;
  }

  withNature(nature: SiteCreationState["nature"]) {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      nature,
    };
    return this;
  }

  /**
   * Seeds the flow's derived `SiteCreationData` in one call. `isFriche`/`nature` are stored as
   * their own top-level fields (set by the pre-engine IS_FRICHE/SITE_NATURE steps — see
   * createSite.reducer.ts) rather than on `initialSiteData`, so they are routed there; every
   * other field goes onto `initialSiteData`, folded underneath whatever `custom` steps are
   * seeded via `withCustomStep`.
   */
  withCreationData(creationData: Partial<SiteCreationData>) {
    const { isFriche, nature, ...rest } = creationData;
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      ...(isFriche !== undefined && { isFriche }),
      ...(nature !== undefined && { nature }),
      initialSiteData: {
        ...this.preloadedRootState.siteCreation.initialSiteData,
        ...rest,
      },
    };
    return this;
  }

  withUrbanZoneSteps(steps: UrbanZoneStepsState) {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      urbanZone: {
        ...this.preloadedRootState.siteCreation.urbanZone,
        steps,
      },
    };
    return this;
  }

  withUrbanZoneCurrentStep(currentStep: UrbanZoneSiteCreationStep) {
    this.preloadedRootState.siteCreation = {
      ...this.preloadedRootState.siteCreation,
      urbanZone: {
        ...this.preloadedRootState.siteCreation.urbanZone,
        currentStep,
      },
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
