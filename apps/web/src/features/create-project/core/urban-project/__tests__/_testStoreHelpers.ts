import { AppDependencies, createStore, RootState } from "@/app/store/store";
import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, ProjectCreationState } from "../../createProject.reducer";
import { mockSiteData } from "./_siteData.mock";

export const getCurrentStep = (store: { getState: () => RootState }): UrbanProjectCreationStep =>
  store.getState().projectCreation.urbanProject.form.currentStep;

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "projectCreation"> = {
    projectCreation: {
      ...getInitialState(),
      siteData: mockSiteData,
    },
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withSteps(steps: ProjectCreationState["urbanProject"]["form"]["steps"]): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      urbanProject: {
        ...this.preloadedRootState.projectCreation.urbanProject,
        form: {
          ...this.preloadedRootState.projectCreation.urbanProject.form,
          steps,
        },
      },
    };
    return this;
  }

  withCurrentUrbanProjectGroupStep(): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      currentProjectFlow: "URBAN_PROJECT",
    };
    return this;
  }

  withCurrentStep(currentStep: UrbanProjectCreationStep): this {
    this.preloadedRootState.projectCreation = {
      ...this.preloadedRootState.projectCreation,
      urbanProject: {
        ...this.preloadedRootState.projectCreation.urbanProject,
        form: {
          ...this.preloadedRootState.projectCreation.urbanProject.form,
          currentStep,
        },
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
