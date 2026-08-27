// Shared plumbing for the site-creation behaviour net.
//
// This suite is a permanent regression oracle for the wizard-form-engine port described in
// .agents/tasks/update-site/DESIGN.md ("Behaviour net for the port"). It must only read state
// through public selectors — never `stepsHistory`, `siteData`, `urbanZone.steps`, or `demo.steps`
// directly — so it survives the port unchanged while the ~145 pre-port unit tests (which do assert
// on that internal shape) are expected to break and be rewritten.
import { AppDependencies, createStore, RootState } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { User } from "@/features/onboarding/core/user";
import { buildUser } from "@/features/onboarding/core/user.mock";
import { initialState as currentUserInitialState } from "@/features/onboarding/core/user.reducer";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState, selectCurrentStep, SiteCreationStep } from "../../createSite.reducer";
import {
  selectExpressResultViewData,
  selectSiteCreationResultViewData,
} from "../../steps/final/final.selectors";

export class BehaviourNetStoreBuilder {
  preloadedRootState: Pick<RootState, "siteCreation" | "currentUser" | "appSettings"> = {
    siteCreation: getInitialState(),
    currentUser: currentUserInitialState,
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

  withAppDependencies(appDependencies: Partial<AppDependencies>): this {
    this._appDependencies = { ...this._appDependencies, ...appDependencies };
    return this;
  }

  build() {
    return createStore(this._appDependencies, this.preloadedRootState);
  }
}

/**
 * Builds a store with an authenticated user and the given `createSiteService` (an
 * InMemoryCreateSiteService, built by the caller) injected, so each behaviour-net spec starts
 * from the same known-good setup and can read the captured payload back off `createSiteService`.
 *
 * The InMemoryCreateSiteService is instantiated by each spec file rather than here, because
 * `*.spec.ts` files are the only ones exempt from the core -> infrastructure import boundary.
 */
export const buildBehaviourNetStore = (createSiteService: AppDependencies["createSiteService"]) => {
  const user = buildUser();
  const store = new BehaviourNetStoreBuilder()
    .withCurrentUser(user)
    .withAppDependencies({ createSiteService })
    .build();
  return { store, user };
};

/** The single selector this suite is allowed to read "which step am I on" from. */
export const currentStep = (store: { getState: () => RootState }): SiteCreationStep =>
  selectCurrentStep(store.getState());

/**
 * The save/loading state after submission, read through the same public selector the
 * creation-result view itself relies on (it mirrors the top-level `saveLoadingState`,
 * which every submission path — custom, urban zone, express — writes to).
 */
export const saveLoadingState = (store: {
  getState: () => RootState;
}): "idle" | "loading" | "success" | "error" =>
  selectSiteCreationResultViewData(store.getState()).loadingState;

/**
 * The id assigned to the site being created, read through the same public result-view
 * selector the creation-result view relies on — never `siteCreation.siteData.id` directly.
 */
export const siteId = (store: { getState: () => RootState }): string =>
  selectSiteCreationResultViewData(store.getState()).siteId;

/** Same as `siteId`, but for the express (demo) creation result view. */
export const expressSiteId = (store: { getState: () => RootState }): string =>
  selectExpressResultViewData(store.getState()).siteId;
