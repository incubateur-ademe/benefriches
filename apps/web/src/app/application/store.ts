import { configureStore, Reducer } from "@reduxjs/toolkit";

import { SiteMunicipalityDataGateway as CreateProjectMunicipalityDataGateway } from "@/features/create-project/core/getSiteLocalAuthorities.action";
import { PhotovoltaicPerformanceGateway } from "@/features/create-project/core/renewable-energy/actions/getPhotovoltaicExpectedPerformance.action";
import { SaveReconversionProjectGateway } from "@/features/create-project/core/saveReconversionProject.action";
import { SaveExpressReconversionProjectGateway } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { SiteMunicipalityDataGateway as CreateSiteMunicipalityDataGateway } from "@/features/create-site/core/actions/siteMunicipalityData.actions";
import { ReconversionProjectImpactsGateway } from "@/features/projects/application/fetchReconversionProjectImpacts.action";
import { ProjectFeaturesGateway } from "@/features/projects/application/project-features/projectFeatures.actions";
import { SiteFeaturesGateway } from "@/features/site-features/application/fetchSiteFeatures.action";
import { AppSettingsGateway } from "@/shared/app-settings/core/AppSettingsGateway";
import { CreateUserGateway } from "@/users/application/createUser.action";
import { CurrentUserGateway } from "@/users/application/initCurrentUser.action";

import { GetSitesByIdGateway } from "../../features/create-project/core/createProject.actions";
import { SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway } from "../../features/create-project/core/soilsCarbonStorage.action";
import { CreateSiteGateway } from "../../features/create-site/core/actions/createSite.actions";
import { SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway } from "../../features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import { ReconversionProjectsListGateway } from "../../features/projects/application/projectsList.actions";
import { getListener, setupAllListeners } from "./listenerMiddleware";
import { rootReducer } from "./rootReducer";

export type AppDependencies = {
  appSettingsService: AppSettingsGateway;
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
  siteFeaturesService: SiteFeaturesGateway;
  projectFeaturesService: ProjectFeaturesGateway;
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
