import { AppDependencies, createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState } from "../projectImpacts.reducer";

export class StoreBuilder {
  preloadedRootState: Pick<RootState, "projectImpacts"> = {
    projectImpacts: getInitialState(),
  };
  _appDependencies: AppDependencies = getTestAppDependencies();

  withEvaluationPeriod(evaluationPeriod: number) {
    this.preloadedRootState.projectImpacts.evaluationPeriod = evaluationPeriod;
    return this;
  }

  withAppDependencies(appDependencies: Partial<AppDependencies>) {
    this._appDependencies = {
      ...this._appDependencies,
      ...appDependencies,
    };
    return this;
  }

  withImpactsData(impactsData: RootState["projectImpacts"]["impactsData"]) {
    this.preloadedRootState.projectImpacts.impactsData = impactsData;
    return this;
  }

  build() {
    return createStore(this._appDependencies, this.preloadedRootState);
  }
}
