import { configureStore } from "@reduxjs/toolkit";
import {
  GetSiteGateway,
  SaveProjectGateway,
} from "../../features/create-project/application/createProject.actions";
import { SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway } from "../../features/create-project/application/soilsCarbonStorage.actions";
import { CreateSiteGateway } from "../../features/create-site/application/createSite.actions";
import { SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway } from "../../features/create-site/application/siteSoilsCarbonStorage.actions";
import {
  ProjectsListGateway,
  SitesGateway,
} from "../../features/projects/application/projectsList.actions";

import projectCreation from "@/features/create-project/application/createProject.reducer";
import { LocalAuthoritiesGateway as ProjectLocalAuthoritiesGateway } from "@/features/create-project/application/projectSiteLocalAuthorities.actions";
import projectSiteLocalAuthorities from "@/features/create-project/application/projectSiteLocalAuthorities.reducer";
import { PhotovoltaicPerformanceGateway } from "@/features/create-project/application/pvExpectedPerformanceStorage.actions";
import projectPvExpectedPerformancesStorage from "@/features/create-project/application/pvExpectedPerformanceStorage.reducer";
import projectSoilsCarbonStorage from "@/features/create-project/application/soilsCarbonStorage.reducer";
import siteCreation from "@/features/create-site/application/createSite.reducer";
import { LocalAuthoritiesGateway as SiteLocalAuthoritiesGateway } from "@/features/create-site/application/siteLocalAuthorities.actions";
import siteLocalAuthorities from "@/features/create-site/application/siteLocalAuthorities.reducer";
import siteCarbonStorage from "@/features/create-site/application/siteSoilsCarbonStorage.reducer";
import projectImpacts from "@/features/projects/application/projectImpacts.reducer";
import { ProjectsDetailsGateway } from "@/features/projects/application/projectImpactsComparison.actions";
import projectImpactsComparison from "@/features/projects/application/projectImpactsComparison.reducer";
import projectsList from "@/features/projects/application/projectsList.reducer";
import currentUser from "@/features/users/application/user.reducer";

export type AppDependencies = {
  soilsCarbonStorageService: SiteSoilsCarbonStorageGateway | ProjectSoilsCarbonStorageGateway;
  createSiteService: CreateSiteGateway;
  saveProjectGateway: SaveProjectGateway;
  getSiteService: GetSiteGateway;
  projectsListService: ProjectsListGateway;
  projectDetailsService: ProjectsDetailsGateway;
  sitesService: SitesGateway;
  photovoltaicPerformanceService: PhotovoltaicPerformanceGateway;
  localAuthoritiesService: SiteLocalAuthoritiesGateway | ProjectLocalAuthoritiesGateway;
};

export const createStore = (appDependencies: AppDependencies) =>
  configureStore({
    reducer: {
      siteCreation,
      projectCreation,
      projectPvExpectedPerformancesStorage,
      siteCarbonStorage,
      projectsList,
      currentUser,
      projectImpacts,
      projectImpactsComparison,
      projectSoilsCarbonStorage,
      siteLocalAuthorities,
      projectSiteLocalAuthorities,
    },
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: appDependencies,
        },
      });
    },
  });

type Store = ReturnType<typeof createStore>;

export type RootState = ReturnType<Store["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
