import { configureStore, Reducer } from "@reduxjs/toolkit";

import type { AnalyticsGateway } from "@/features/analytics/core/gateways/AnalyticsGateway";
import { AppSettingsGateway } from "@/features/app-settings/core/AppSettingsGateway";
import { GetSitesByIdGateway } from "@/features/create-project/core/actions/reconversionProjectCreationInitiated.action";
import { SaveReconversionProjectGateway } from "@/features/create-project/core/actions/saveReconversionProject.action";
import { CreateExpressReconversionProjectGateway } from "@/features/create-project/core/demo/demoProject.actions";
import { PhotovoltaicPerformanceGateway } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { CreateSiteGateway } from "@/features/create-site/core/createSiteGateway";
import { SiteEvaluationGateway } from "@/features/my-evaluations/application/evaluationsList.actions";
import { AuthenticationGateway } from "@/features/onboarding/core/AuthenticationGateway";
import { CreateUserGateway } from "@/features/onboarding/core/createUser.action";
import { CurrentUserGateway } from "@/features/onboarding/core/initCurrentUser.action";
import { ProjectFeaturesGateway } from "@/features/projects/application/project-features/projectFeatures.actions";
import { ReconversionProjectImpactsGateway } from "@/features/projects/application/project-impacts/actions";
import { QuickUrbanProjectImpactsGateway } from "@/features/projects/application/project-impacts/actions/fetchQuickImpactsForUrbanProjectOnFriche.action";
import { UrbanSprawlImpactsComparisonGateway } from "@/features/projects/application/project-impacts/actions/urbanSprawlImpactsComparisonRequested.action";
import { ReconversionCompatibilityEvaluationGateway } from "@/features/reconversion-compatibility/core/actions/reconversionCompatibilityEvaluationGateway";
import type { SiteGateway } from "@/features/sites/core/gateways/SiteGateway";
import type { SupportChatGateway } from "@/features/support/core/gateways/SupportChatGateway";
import { UpdateProjectServiceGateway } from "@/features/update-project/core/updateProject.types";
import { CreateFeatureAlertGateway } from "@/features/user-feature-alerts/core/CreateFeatureAlertGateway";
import type { AdministrativeDivisionGateway } from "@/shared/core/gateways/AdministrativeDivisionGateway";
import { RealEstateValuationGateway } from "@/shared/core/gateways/RealEstateValuationGateway";
import type { SoilsCarbonStorageGateway } from "@/shared/core/gateways/SoilsCarbonStorageGateway";

import { getListener, setupAllListeners } from "./listenerMiddleware";
import { rootReducer } from "./rootReducer";

export type AppDependencies = {
  appSettingsService: AppSettingsGateway;
  authService: AuthenticationGateway;
  soilsCarbonStorageService: SoilsCarbonStorageGateway;
  createSiteService: CreateSiteGateway;
  saveReconversionProjectService: SaveReconversionProjectGateway;
  createExpressReconversionProjectService: CreateExpressReconversionProjectGateway;
  siteEvaluationService: SiteEvaluationGateway;
  getSiteByIdService: GetSitesByIdGateway;
  photovoltaicPerformanceService: PhotovoltaicPerformanceGateway;
  municipalityDataService: AdministrativeDivisionGateway;
  reconversionProjectImpacts: ReconversionProjectImpactsGateway;
  currentUserService: CurrentUserGateway;
  createUserService: CreateUserGateway;
  createUserFeatureAlertService: CreateFeatureAlertGateway;
  siteService: SiteGateway;
  projectFeaturesService: ProjectFeaturesGateway;
  quickUrbanProjectImpactsService: QuickUrbanProjectImpactsGateway;
  urbanSprawlImpactsComparisonService: UrbanSprawlImpactsComparisonGateway;
  reconversionCompatibilityEvaluationService: ReconversionCompatibilityEvaluationGateway;
  updateProjectService: UpdateProjectServiceGateway;
  realEstateValuationService: RealEstateValuationGateway;
  supportChatService: SupportChatGateway;
  analyticsService: AnalyticsGateway;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PreloadedStateFromReducer<R extends Reducer<any, any, any>> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  R extends Reducer<any, any, infer P> ? P : never;

export const createStore = (
  appDependencies: AppDependencies,
  preloadedState?: PreloadedStateFromReducer<typeof rootReducer>,
) => {
  const persistedAppSettings = appDependencies.appSettingsService.getAll();

  const listener = getListener(appDependencies);

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      appSettings: persistedAppSettings,
      ...preloadedState,
    },
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: appDependencies,
        },
      }).prepend(listener.middleware);
    },
  });

  setupAllListeners(listener.startListening.withTypes<RootState, AppDispatch, AppDependencies>());

  return store;
};

type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
