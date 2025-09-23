import { configureStore, Reducer } from "@reduxjs/toolkit";

import { AppSettingsGateway } from "@/features/app-settings/core/AppSettingsGateway";
import { SaveExpressReconversionProjectGateway } from "@/features/create-project/core/actions/expressProjectSavedGateway";
import { SiteMunicipalityDataGateway as CreateProjectMunicipalityDataGateway } from "@/features/create-project/core/actions/getSiteLocalAuthorities.action";
import { SaveReconversionProjectGateway } from "@/features/create-project/core/actions/saveReconversionProject.action";
import { GetSitesByIdGateway } from "@/features/create-project/core/actions/urbanProjectCreationInitiated.action";
import { PhotovoltaicPerformanceGateway } from "@/features/create-project/core/renewable-energy/actions/getPhotovoltaicExpectedPerformance.action";
import { CreateSiteGateway } from "@/features/create-site/core/actions/finalStep.actions";
import { SiteMunicipalityDataGateway as CreateSiteMunicipalityDataGateway } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import { FricheMutabilityEvaluationGateway } from "@/features/friche-mutability/core/fricheMutability.actions";
import { AuthenticationGateway } from "@/features/onboarding/core/AuthenticationGateway";
import { CreateUserGateway } from "@/features/onboarding/core/createUser.action";
import { CurrentUserGateway } from "@/features/onboarding/core/initCurrentUser.action";
import { ProjectFeaturesGateway } from "@/features/projects/application/project-features/projectFeatures.actions";
import { UrbanSprawlImpactsComparisonGateway } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";
import { ReconversionProjectImpactsGateway } from "@/features/projects/application/project-impacts/actions";
import { QuickUrbanProjectImpactsGateway } from "@/features/projects/application/project-impacts/fetchQuickImpactsForUrbanProjectOnFriche.action";
import { SiteFeaturesGateway } from "@/features/site-features/core/fetchSiteFeatures.action";
import { CreateFeatureAlertGateway } from "@/features/user-feature-alerts/core/CreateFeatureAlertGateway";

import { SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway } from "../../../features/create-project/core/actions/soilsCarbonStorage.action";
import { SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway } from "../../../features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import { ReconversionProjectsListGateway } from "../../../features/projects/application/projects-list/projectsList.actions";
import { getListener, setupAllListeners } from "./listenerMiddleware";
import { rootReducer } from "./rootReducer";

export type AppDependencies = {
  appSettingsService: AppSettingsGateway;
  authService: AuthenticationGateway;
  soilsCarbonStorageService: SiteSoilsCarbonStorageGateway | ProjectSoilsCarbonStorageGateway;
  createSiteService: CreateSiteGateway;
  saveReconversionProjectService: SaveReconversionProjectGateway;
  saveExpressReconversionProjectService: SaveExpressReconversionProjectGateway;
  reconversionProjectsListService: ReconversionProjectsListGateway;
  getSiteByIdService: GetSitesByIdGateway;
  photovoltaicPerformanceService: PhotovoltaicPerformanceGateway;
  municipalityDataService: CreateSiteMunicipalityDataGateway | CreateProjectMunicipalityDataGateway;
  reconversionProjectImpacts: ReconversionProjectImpactsGateway;
  currentUserService: CurrentUserGateway;
  createUserService: CreateUserGateway;
  createUserFeatureAlertService: CreateFeatureAlertGateway;
  siteFeaturesService: SiteFeaturesGateway;
  projectFeaturesService: ProjectFeaturesGateway;
  quickUrbanProjectImpactsService: QuickUrbanProjectImpactsGateway;
  urbanSprawlImpactsComparisonService: UrbanSprawlImpactsComparisonGateway;
  fricheMutabilityEvaluationService: FricheMutabilityEvaluationGateway;
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
