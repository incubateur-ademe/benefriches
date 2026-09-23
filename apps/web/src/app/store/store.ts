import type { Reducer } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";

import type { AnalyticsGateway } from "@/features/analytics/core/gateways/AnalyticsGateway";
import type { AppSettingsGateway } from "@/features/app-settings/core/AppSettingsGateway";
import type { GetSitesByIdGateway } from "@/features/create-project/core/actions/reconversionProjectCreationInitiated.action";
import type { SaveReconversionProjectGateway } from "@/features/create-project/core/actions/saveReconversionProject.action";
import type { CreateExpressReconversionProjectGateway } from "@/features/create-project/core/demo/demoProject.actions";
import type { PhotovoltaicPerformanceGateway } from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import type { CreateSiteGateway } from "@/features/create-site/core/createSiteGateway";
import type { SiteEvaluationGateway } from "@/features/my-evaluations/application/evaluationsList.actions";
import type { AuthenticationGateway } from "@/features/onboarding/core/AuthenticationGateway";
import type { CreateUserGateway } from "@/features/onboarding/core/createUser.action";
import type { CurrentUserGateway } from "@/features/onboarding/core/initCurrentUser.action";
import type { ProjectFeaturesGateway } from "@/features/projects/application/project-features/projectFeatures.actions";
import type { ReconversionProjectImpactsGateway } from "@/features/projects/application/project-impacts/actions";
import type { QuickUrbanProjectImpactsGateway } from "@/features/projects/application/project-impacts/actions/fetchQuickImpactsForUrbanProjectOnFriche.action";
import type { UrbanSprawlImpactsComparisonGateway } from "@/features/projects/application/project-impacts/actions/urbanSprawlImpactsComparisonRequested.action";
import type { ReconversionCompatibilityEvaluationGateway } from "@/features/reconversion-compatibility/core/actions/reconversionCompatibilityEvaluationGateway";
import type { SiteGateway } from "@/features/sites/core/gateways/SiteGateway";
import type { SupportChatGateway } from "@/features/support/core/gateways/SupportChatGateway";
import type { UpdateProjectServiceGateway } from "@/features/update-project/core/updateProject.types";
import type { UpdateSiteServiceGateway } from "@/features/update-site/core/updateSite.types";
import type { CreateFeatureAlertGateway } from "@/features/user-feature-alerts/core/CreateFeatureAlertGateway";
import type { AdministrativeDivisionGateway } from "@/shared/core/gateways/AdministrativeDivisionGateway";
import type { RealEstateValuationGateway } from "@/shared/core/gateways/RealEstateValuationGateway";
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
  updateSiteService: UpdateSiteServiceGateway;
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
