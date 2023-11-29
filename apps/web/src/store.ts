import { configureStore } from "@reduxjs/toolkit";
import {
  GetSiteGateway,
  SaveProjectGateway,
} from "./features/create-project/application/createProject.actions";
import { SoilsCarbonStorageGateway as ProjectSoilsCarbonStorageGateway } from "./features/create-project/application/soilsCarbonStorage.actions";
import { CreateSiteGateway } from "./features/create-site/application/createSite.actions";
import { SoilsCarbonStorageGateway as SiteSoilsCarbonStorageGateway } from "./features/create-site/application/siteSoilsCarbonStorage.actions";
import {
  ProjectsListGateway,
  SitesGateway,
} from "./features/projects/application/projectsList.actions";

import projectCreation from "@/features/create-project/application/createProject.reducer";
import projectSoilsCarbonStorage from "@/features/create-project/application/soilsCarbonStorage.reducer";
import siteCreation from "@/features/create-site/application/createSite.reducer";
import siteCarbonStorage from "@/features/create-site/application/siteSoilsCarbonStorage.reducer";
import { ProjectsDetailsGateway } from "@/features/projects/application/projectDetails.actions";
import projectDetails from "@/features/projects/application/projectDetails.reducer";
import projectsList from "@/features/projects/application/projectsList.reducer";
import currentUser from "@/features/users/application/user.reducer";

export type AppDependencies = {
  soilsCarbonStorageService:
    | SiteSoilsCarbonStorageGateway
    | ProjectSoilsCarbonStorageGateway;
  createSiteService: CreateSiteGateway;
  saveProjectGateway: SaveProjectGateway;
  getSiteService: GetSiteGateway;
  projectsListService: ProjectsListGateway;
  projectDetailsService: ProjectsDetailsGateway;
  sitesService: SitesGateway;
};

export const createStore = (appDependencies: AppDependencies) =>
  configureStore({
    reducer: {
      siteCreation,
      projectCreation,
      siteCarbonStorage,
      projectsList,
      currentUser,
      projectDetails,
      projectSoilsCarbonStorage,
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
