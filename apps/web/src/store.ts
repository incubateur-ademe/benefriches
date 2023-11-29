import { configureStore } from "@reduxjs/toolkit";
import {
  GetSiteGateway,
  SaveProjectGateway,
} from "./features/create-project/application/createProject.actions";
import { CreateSiteGateway } from "./features/create-site/application/createSite.actions";
import {
  ProjectsListGateway,
  SitesGateway,
} from "./features/projects/application/projectsList.actions";
import { SoilsCarbonStorageGateway } from "./shared/domain/gateways/SoilsCarbonStorageApi";

import projectCreation from "@/features/create-project/application/createProject.reducer";
import projectSoilsCarbonStorage from "@/features/create-project/application/soilsCarbonStorage.reducer";
import siteCreation from "@/features/create-site/application/createSite.reducer";
import siteCarbonStorage from "@/features/create-site/application/siteSoilsCarbonStorage.reducer";
import projectsList from "@/features/projects/application/projectsList.reducer";
import currentUser from "@/features/users/application/user.reducer";

export type AppDependencies = {
  soilsCarbonStorageService: SoilsCarbonStorageGateway;
  createSiteService: CreateSiteGateway;
  saveProjectGateway: SaveProjectGateway;
  getSiteService: GetSiteGateway;
  projectsListService: ProjectsListGateway;
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
