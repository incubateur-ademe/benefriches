import { configureStore } from "@reduxjs/toolkit";
import { GetSiteGateway } from "./features/create-project/application/createProject.actions";
import { CreateSiteGateway } from "./features/create-site/application/createSite.actions";
import { SoilsCarbonStorageGateway } from "./features/create-site/application/siteSoilsCarbonStorage.actions";
import { ProjectsListGateway } from "./features/projects/application/projectsList.actions";

import projectCreation from "@/features/create-project/application/createProject.reducer";
import siteCreation from "@/features/create-site/application/createSite.reducer";
import siteCarbonStorage from "@/features/create-site/application/siteSoilsCarbonStorage.reducer";
import projectsList from "@/features/projects/application/projectsList.reducer";

export type AppDependencies = {
  soilsCarbonStorageService: SoilsCarbonStorageGateway;
  createSiteService: CreateSiteGateway;
  getSiteService: GetSiteGateway;
  projectsListService: ProjectsListGateway;
};

export const createStore = (appDependencies: AppDependencies) =>
  configureStore({
    reducer: {
      siteCreation,
      projectCreation,
      siteCarbonStorage,
      projectsList,
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
