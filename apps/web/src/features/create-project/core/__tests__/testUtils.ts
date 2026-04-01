import { AppDependencies, createStore, RootState } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { User } from "@/features/onboarding/core/user";
import { initialState } from "@/features/onboarding/core/user.reducer";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState } from "../createProject.reducer";
import { ProjectSite } from "../project.types";

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "projectCreation" | "currentUser" | "appSettings"> = {
    projectCreation: getInitialState(),
    currentUser: initialState,
    appSettings: { ...DEFAULT_APP_SETTINGS, askForConfirmationOnStepRevert: false },
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

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
