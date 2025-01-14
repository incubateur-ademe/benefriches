import { combineReducers } from "@reduxjs/toolkit";

import projectCreation from "@/features/create-project/core/createProject.reducer";
import siteCreation from "@/features/create-site/core/createSite.reducer";
import siteMunicipalityData from "@/features/create-site/core/siteMunicipalityData.reducer";
import siteCarbonStorage from "@/features/create-site/core/siteSoilsCarbonStorage.reducer";
import { projectFeaturesReducer } from "@/features/projects/application/project-features/projectFeatures.reducer";
import projectImpacts from "@/features/projects/application/projectImpacts.reducer";
import reconversionProjectsList from "@/features/projects/application/projectsList.reducer";
import siteFeatures from "@/features/site-features/application/siteFeatures.reducer";
import { appSettingsReducer as appSettings } from "@/shared/app-settings/core/appSettings";
import currentUser from "@/users/application/user.reducer";

export const rootReducer = combineReducers({
  appSettings,
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
