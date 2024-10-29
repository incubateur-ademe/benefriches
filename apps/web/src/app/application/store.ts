import { combineReducers, configureStore, Reducer } from "@reduxjs/toolkit";

import projectCreation from "@/features/create-project/application/createProject.reducer";
import { SiteMunicipalityDataGateway as CreateProjectMunicipalityDataGateway } from "@/features/create-project/application/getSiteLocalAuthorities.action";
import { PhotovoltaicPerformanceGateway } from "@/features/create-project/application/renewable-energy/getPhotovoltaicExpectedPerformance.action";
import { SaveReconversionProjectGateway } from "@/features/create-project/application/renewable-energy/saveReconversionProject.action";
import { SaveExpressReconversionProjectGateway } from "@/features/create-project/application/urban-project/urbanProject.actions";
import siteCreation from "@/features/create-site/application/createSite.reducer";
import { SiteMunicipalityDataGateway as CreateSiteMunicipalityDataGateway } from "@/features/create-site/application/siteMunicipalityData.actions";
import siteMunicipalityData from "@/features/create-site/application/siteMunicipalityData.reducer";
import siteCarbonStorage from "@/features/create-site/application/siteSoilsCarbonStorage.reducer";
import { ReconversionProjectImpactsGateway } from "@/features/projects/application/fetchReconversionProjectImpacts.action";
import { ProjectFeaturesGateway } from "@/features/projects/application/project-features/projectFeatures.actions";
import { projectFeaturesReducer } from "@/features/projects/application/project-features/projectFeatures.reducer";
import projectImpacts from "@/features/projects/application/projectImpacts.reducer";
import reconversionProjectsList from "@/features/projects/application/projectsList.reducer";
import { SiteFeaturesGateway } from "@/features/site-features/application/fetchSiteFeatures.action";
import siteFeatures from "@/features/site-features/application/siteFeatures.reducer";
import { CreateUserGateway } from "@/features/users/application/createUser.action";
import { CurrentUserGateway } from "@/features/users/application/initCurrentUser.action";
import currentUser from "@/features/users/application/user.reducer";

import { GetSitesByIdGateway } from "../../features/create-project/application/createProject.actions";
import { SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway } from "../../features/create-project/application/soilsCarbonStorage.action";
import { CreateSiteGateway } from "../../features/create-site/application/createSite.actions";
import { SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway } from "../../features/create-site/application/siteSoilsCarbonStorage.actions";
import { ReconversionProjectsListGateway } from "../../features/projects/application/projectsList.actions";

export type AppDependencies = {
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

const rootReducer = combineReducers({
  siteCreation,
  siteFeatures,
  projectCreation,
  siteCarbonStorage,
  reconversionProjectsList,
  currentUser,
  projectImpacts,
  projectFeatures: projectFeaturesReducer,
  siteMunicipalityData,
});

export const createStore = (
  appDependencies: AppDependencies,
  preloadedState?: PreloadedStateFromReducer<typeof rootReducer>,
) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: appDependencies,
        },
      });
    },
  });
};

type Store = ReturnType<typeof createStore>;

export type RootState = ReturnType<Store["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
