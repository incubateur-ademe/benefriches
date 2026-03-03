import { AppDependencies, createStore, RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import { getInitialState, ProjectCreationState } from "../../createProject.reducer";
import { RenewableEnergyProjectState } from "../renewableEnergy.reducer";
import type { RenewableEnergyCreationStep } from "../renewableEnergySteps";

export const getCurrentStep = (store: { getState: () => RootState }): RenewableEnergyCreationStep =>
  store.getState().projectCreation.renewableEnergyProject.currentStep;

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "projectCreation"> = {
    projectCreation: {
      ...getInitialState(),
      siteData: relatedSiteData,
    },
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withSteps(steps: RenewableEnergyProjectState["steps"]): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      renewableEnergyProject: {
        ...this.preloadedRootState.projectCreation.renewableEnergyProject,
        steps,
      },
    };
    return this;
  }

  withCurrentStep(currentStep: RenewableEnergyCreationStep): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      renewableEnergyProject: {
        ...this.preloadedRootState.projectCreation.renewableEnergyProject,
        currentStep,
      },
    };
    return this;
  }

  withSiteData(siteData: ProjectCreationState["siteData"]): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      siteData,
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
