import { configureStore } from "@reduxjs/toolkit";
import { SoilsCarbonSequestrationGateway } from "./features/create-site/application/siteSoilsCarbonSequestration.actions";

import fricheCreation from "@/features/create-site/application/createFriche.reducer";
import naturalAreaCreation from "@/features/create-site/application/createNaturalArea.reducer";
import siteCreation from "@/features/create-site/application/createSite.reducer";
import siteCarbonSequestration from "@/features/create-site/application/siteSoilsCarbonSequestration.reducer";

export type AppDependencies = {
  soilsCarbonSequestrationService: SoilsCarbonSequestrationGateway;
};

export const createStore = (appDependencies: AppDependencies) =>
  configureStore({
    reducer: {
      siteCreation,
      fricheCreation,
      naturalAreaCreation,
      siteCarbonSequestration,
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
