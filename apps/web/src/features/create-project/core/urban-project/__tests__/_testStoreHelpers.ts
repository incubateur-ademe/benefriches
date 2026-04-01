import { AppDependencies, createStore, RootState } from "@/app/store/store";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, ProjectCreationState } from "../../createProject.reducer";
import { mockSiteData } from "./_siteData.mock";

export const getCurrentStep = (store: { getState: () => RootState }): UrbanProjectCreationStep =>
  store.getState().projectCreation.urbanProject.currentStep;

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "projectCreation"> = {
    projectCreation: {
      ...getInitialState(),
      siteData: mockSiteData,
    },
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withSteps(steps: ProjectCreationState["urbanProject"]["steps"]): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      urbanProject: {
        ...this.preloadedRootState.projectCreation.urbanProject,
        steps,
      },
    };
    return this;
  }

  withCurrentUrbanProjectGroupStep(): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      currentStepGroup: "URBAN_PROJECT",
    };
    return this;
  }

  withCurrentStep(currentStep: UrbanProjectCreationStep): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      urbanProject: {
        ...this.preloadedRootState.projectCreation.urbanProject,
        currentStep,
      },
    };
    return this;
  }

  withSiteData(siteData: Partial<ProjectCreationState["siteData"]>): this {
    const currentSiteData = this.preloadedRootState.projectCreation.siteData ?? mockSiteData;

    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      siteData: {
        ...currentSiteData,
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
