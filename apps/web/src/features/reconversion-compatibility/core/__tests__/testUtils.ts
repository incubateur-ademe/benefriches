import { MutabilityUsage } from "shared";

import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { User } from "@/features/onboarding/core/user";
import { initialState } from "@/features/onboarding/core/user.reducer";
import { AppDependencies, createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { ReconversionCompatibilityEvaluationResults } from "../actions/compatibilityEvaluationResultsRequested.actions";
import { getInitialState } from "../reconversionCompatibilityEvaluation.reducer";

export class StoreBuilder {
  preloadedRootState: Pick<
    RootState,
    "reconversionCompatibilityEvaluation" | "currentUser" | "appSettings"
  > = {
    reconversionCompatibilityEvaluation: getInitialState(),
    currentUser: initialState,
    appSettings: { ...DEFAULT_APP_SETTINGS, askForConfirmationOnStepRevert: false },
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withEvaluationResults(results: ReconversionCompatibilityEvaluationResults): this {
    this.preloadedRootState.reconversionCompatibilityEvaluation = {
      ...this.preloadedRootState.reconversionCompatibilityEvaluation,
      evaluationResults: results,
      evaluationResultsLoadingState: "success",
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

  withAppDependencies(appDependencies: Partial<AppDependencies>): this {
    this._appDependencies = {
      ...this._appDependencies,
      ...appDependencies,
    };
    return this;
  }

  withSaveSiteState(saveState: {
    loadingState?: "idle" | "loading" | "success" | "error";
    error?: string;
  }): this {
    this.preloadedRootState.reconversionCompatibilityEvaluation = {
      ...this.preloadedRootState.reconversionCompatibilityEvaluation,
      saveSiteLoadingState: saveState.loadingState ?? "idle",
      saveSiteError: saveState.error,
    };
    return this;
  }

  withCurrentEvaluationId(evaluationId: string): this {
    this.preloadedRootState.reconversionCompatibilityEvaluation = {
      ...this.preloadedRootState.reconversionCompatibilityEvaluation,
      currentEvaluationId: evaluationId,
    };
    return this;
  }

  build() {
    return createStore(this._appDependencies, this.preloadedRootState);
  }
}

export const buildMockEvaluationResults = (
  overrides?: Partial<ReconversionCompatibilityEvaluationResults>,
): ReconversionCompatibilityEvaluationResults => {
  const top3Usages: { usage: MutabilityUsage; score: number; rank: number }[] = [
    { usage: "photovoltaique", score: 0.9, rank: 1 },
    { usage: "residentiel", score: 0.75, rank: 2 },
    { usage: "tertiaire", score: 0.6, rank: 3 },
  ];

  return {
    mutafrichesId: "test-mutafriches-id",
    reliabilityScore: 0.85,
    top3Usages,
    evaluationInput: {
      cadastreId: "test-cadastre-123",
      city: "Paris",
      cityCode: "75001",
      surfaceArea: 15000,
      lat: 48.8566,
      long: 2.3522,
      buildingsFootprintSurfaceArea: 3000,
    },
    ...overrides,
  };
};
